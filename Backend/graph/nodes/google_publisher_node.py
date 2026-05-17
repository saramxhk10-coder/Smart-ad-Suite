
###################################################################################################################



# # graph/nodes/google_publisher_node.py
# # agents/google_publisher_node.py
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import traceback
from datetime import datetime
from typing import List


from google.ads.googleads.v22.services.services.campaign_budget_service import (
    CampaignBudgetServiceClient,
)
from google.ads.googleads.v22.services.types.campaign_budget_service import (
    CampaignBudgetOperation,
    MutateCampaignBudgetsResponse,
)
from google.ads.googleads.v22.services.services.campaign_service import (
    CampaignServiceClient,
)
from google.ads.googleads.v22.services.types.campaign_service import (
    CampaignOperation,
    MutateCampaignsResponse,
)
from google.ads.googleads.v22.resources.types.campaign_budget import (
    CampaignBudget,
)
from google.ads.googleads.v22.resources.types.campaign import Campaign

from google.ads.googleads.v22.services.services.ad_group_service import (
    AdGroupServiceClient,
)
from google.ads.googleads.v22.services.types.ad_group_service import (
    AdGroupOperation,
    MutateAdGroupsResponse,
)
from google.ads.googleads.v22.services.services.campaign_service import (
    CampaignServiceClient,
)
from google.ads.googleads.v22.resources.types.ad_group import AdGroup


_DATE_FORMAT: str = "%Y%m%d"
import sys
import json


def handle_googleads_exception(exception: GoogleAdsException) -> None:
    print(
        f'Request with ID "{exception.request_id}" failed with status '
        f'"{exception.error.code().name}" and includes the following errors:'
    )
    for error in exception.failure.errors:
        print(f'\tError with message "{error.message}".')
        if error.location:
            for field_path_element in error.location.field_path_elements:
                print(f"\t\tOn field: {field_path_element.field_name}")
    sys.exit(1)



def check_duplicate_campaign(client: GoogleAdsClient, customer_id: str, campaign_name: str):
    """
    Checks if a campaign with the given name already exists.
    Raises ValueError if duplicate is found.
    """
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT
            campaign.id,
            campaign.name
        FROM campaign
        WHERE campaign.name = '{campaign_name}'
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    for row in response:
        # Found duplicate
        raise ValueError(f"Campaign name '{campaign_name}' already exists (ID: {row.campaign.id})")





def debug_resource(obj, name):
    # Converts proto-plus object to dict for easy inspection
    try:
        from google.protobuf.json_format import MessageToDict
        print(f"\n[DEBUG] {name}:")
        print(json.dumps(MessageToDict(obj, preserving_proto_field_name=True), indent=2))
    except Exception:
        print(f"[DEBUG] {name}: {obj}")


def normalize_budget(amount_micros: int) -> int:
    """
    Ensure daily budget is at least 1 unit (1_000_000 micros)
    """
    MIN_DAILY_BUDGET = 1_000_000
    if not amount_micros or amount_micros < MIN_DAILY_BUDGET:
        return MIN_DAILY_BUDGET
    return (amount_micros // 1_000_000) * 1_000_000


def google_publish_node(state):
    creds = state.get("credentials", {})
    payload = state.get("packaged_payloads", {}).get("google", {})

    if not creds:
        raise ValueError("Missing Google Ads credentials")

    # Build client config dynamically
    config = {
        "developer_token": creds["developer_token"],
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"],
        "use_proto_plus": True
    }

    # Optional login_customer_id for MCC accounts
    login_customer_id = creds.get("login_customer_id")
    if login_customer_id:
        login_customer_id = str(login_customer_id)
        if len(login_customer_id) == 10 and login_customer_id.isdigit():
            config["login_customer_id"] = login_customer_id
        else:
            raise ValueError("login_customer_id must be a 10-digit string")

    # Load Google Ads client
    client = GoogleAdsClient.load_from_dict(config, version="v22")

    customer_id = str(creds["customer_id"])
    if len(customer_id) != 10:
        raise ValueError("customer_id must be a 10-digit string")

    
        # ---------------------------
        # 1️⃣ Campaign Budget
        # ---------------------------
    try:
        campaign_budget_service: CampaignBudgetServiceClient = client.get_service(
            "CampaignBudgetService"
        )
        campaign_service: CampaignServiceClient = client.get_service(
            "CampaignService"
        )
        # Check for duplicate campaign name
        check_duplicate_campaign(client, customer_id, payload["campaign"]["name"])

                # Create a budget, which can be shared by multiple campaigns.
        campaign_budget_operation: CampaignBudgetOperation = client.get_type(
            "CampaignBudgetOperation"
        )
        campaign_budget: CampaignBudget = campaign_budget_operation.create
        campaign_budget.name = f"{payload['campaign']['name']} Budget"
        campaign_budget.delivery_method = (
            client.enums.BudgetDeliveryMethodEnum.STANDARD
        )
        campaign_budget.amount_micros = normalize_budget(payload["campaign"]["budget_micros"])



        debug_resource(campaign_budget, "CampaignBudget")  # ✅ Debug

    # Add budget.
        campaign_budget_response: MutateCampaignBudgetsResponse
        try:
            budget_operations: List[CampaignBudgetOperation] = [
                campaign_budget_operation
            ]
            campaign_budget_response = (
                campaign_budget_service.mutate_campaign_budgets(
                    customer_id=customer_id,
                    operations=budget_operations,
                )
            )
        except GoogleAdsException as ex:
            handle_googleads_exception(ex)
            # We are exiting in handle_googleads_exception so this return is not
            # strictly necessary, but it makes static analysis happier.
            return


            # ---------------------------
            # 2️⃣ Search Campaign
            # ---------------------------
            # Create campaign.

            # 1️⃣ Campaign Operation
        campaign_operation: CampaignOperation = client.get_type("CampaignOperation")
        campaign: Campaign = campaign_operation.create
        campaign.name = payload["campaign"]["name"]
        campaign.advertising_channel_type = (
            client.enums.AdvertisingChannelTypeEnum.SEARCH
        )

        campaign.status = client.enums.CampaignStatusEnum.PAUSED
        campaign.manual_cpc = client.get_type("ManualCpc")
        campaign.campaign_budget = campaign_budget_response.results[0].resource_name

        # Set the campaign network options.
        campaign.network_settings.target_google_search = True
        campaign.network_settings.target_search_network = True
        campaign.network_settings.target_partner_search_network = False
        # Enable Display Expansion on Search campaigns. For more details see:
        # https://support.google.com/google-ads/answer/7193800
        campaign.network_settings.target_content_network = True

        # Declare whether or not this campaign serves political ads targeting the
        # EU. Valid values are:
        #   CONTAINS_EU_POLITICAL_ADVERTISING
        #   DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        campaign.contains_eu_political_advertising = (
            client.enums.EuPoliticalAdvertisingStatusEnum.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        )


        # # Optional: Set the start date.
        # start_time: datetime.date = datetime.date + datetime.timedelta(
        #     days=1
        # )
        # campaign.start_date = datetime.date.strftime(start_time, _DATE_FORMAT)

        # # Optional: Set the end date.
        # end_time: datetime.date = start_time + datetime.timedelta(weeks=4)
        # campaign.end_date = datetime.date.strftime(end_time, _DATE_FORMAT)


        # Add the campaign.
        campaign_response: MutateCampaignsResponse
        try:
            campaign_operations: List[CampaignOperation] = [campaign_operation]
            campaign_response = campaign_service.mutate_campaigns(
                customer_id=customer_id, operations=campaign_operations
            )
            print(f"Created campaign {campaign_response.results[0].resource_name}.")
            campaign_resource_name = campaign_response.results[0].resource_name

            print(f"Campaign ID: {campaign_resource_name}")
        except GoogleAdsException as ex:
            handle_googleads_exception(ex)




        # ---------------------------
        # 3️⃣ Ad Group
        # ---------------------------

        ad_group_service: AdGroupServiceClient = client.get_service(
            "AdGroupService"
        )
        campaign_service: CampaignServiceClient = client.get_service(
            "CampaignService"
        )

        # Create ad group.
        ad_group_operation: AdGroupOperation = client.get_type("AdGroupOperation")
        ad_group: AdGroup = ad_group_operation.create
        ad_group.name = payload["ad_group"]["name"]
        ad_group.status = client.enums.AdGroupStatusEnum.ENABLED
        ad_group.campaign = campaign_resource_name
        ad_group.type_ = client.enums.AdGroupTypeEnum.SEARCH_STANDARD
        ad_group.cpc_bid_micros = 10000000


        operations: List[AdGroupOperation] = [ad_group_operation]

        # Add the ad group.
        ad_group_response: MutateAdGroupsResponse = (
            ad_group_service.mutate_ad_groups(
                customer_id=customer_id,
                operations=operations,
            )
        )
        print(f"Created ad group {ad_group_response.results[0].resource_name}.")





        # ---------------------------
        # 4️⃣ Responsive Search Ad
        # ---------------------------
        headlines = payload["responsive_search_ad"]["headlines"][:15]
        descriptions = payload["responsive_search_ad"]["descriptions"][:4]

        if len(headlines) < 3 or len(descriptions) < 2:
            raise ValueError("RSA requires ≥3 headlines and ≥2 descriptions")

        ad_service = client.get_service("AdGroupAdService")
        ad_op = client.get_type("AdGroupAdOperation")
        ad = ad_op.create

        ad.ad_group = ad_group_response.results[0].resource_name
        ad.status = client.enums.AdGroupAdStatusEnum.PAUSED

        rsa = ad.ad.responsive_search_ad
        MAX_HEADLINE = 30
        MAX_DESCRIPTION = 90

        # Headlines
        for h in headlines:
            headline_obj = client.get_type("AdTextAsset")
            headline_obj.text = h[:MAX_HEADLINE]  # truncate to 30 chars
            rsa.headlines.append(headline_obj)

        # Descriptions
        for d in descriptions:
            desc_obj = client.get_type("AdTextAsset")
            desc_obj.text = d[:MAX_DESCRIPTION]  # truncate to 90 chars
            rsa.descriptions.append(desc_obj)

        ad.ad.final_urls.append(payload["responsive_search_ad"]["final_urls"][0])

        debug_resource(ad, "ResponsiveSearchAd")  # ✅ Debug


        ad_response = ad_service.mutate_ad_group_ads(
            customer_id=customer_id,
            operations=[ad_op],
        )

        return {
            "campaign": campaign_response,
            "ad_group": ad_group_response,
            "ad": ad_response.results[0].resource_name,
            "budget": campaign_budget_response,
        }

    # except GoogleAdsException as ex:
    #     for error in ex.failure.errors:
    #         print("\n🔴 Google Ads Error:")
    #         print("Message:", error.message)
    #         print("Error code:", error.error_code)

    #         if error.location:
    #             for field in error.location.field_path_elements:
    #                 print("Missing/Invalid field:", field.field_name)

    except GoogleAdsException as ex:
        # Convert GoogleAdsException into a dict for API response
        errors = []
        for err in ex.failure.errors:
            errors.append({
                "message": err.message,
                "field": [f.field_name for f in (err.location.field_path_elements or [])]
            })
        # Raise as a ValueError with structured info
        raise ValueError({"status": "failed", "errors": errors, "type": "google_ads"})




