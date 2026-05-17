



from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from agents.meta_image_upload import upload_meta_image




# agents/meta_publisher_agent.py
def publish_meta_ads(state):
    try:
        creds = state["credentials"]
        payload = state["packaged_payloads"]["meta"]

        FacebookAdsApi.init(access_token=creds["access_token"])
        account = AdAccount(f"act_{creds['account_id']}")

        # Upload image
        image_hash = upload_meta_image(
            state["image_path"],
            creds["account_id"],
            creds["access_token"]
        )

        # Create campaign
        campaign_name = state.get("campaign_config", {}).get("name", payload["campaign"]["name"])
        campaign = account.create_campaign(params={
            "name": campaign_name,
            "objective": payload["campaign"]["objective"],
            "status": "PAUSED",
            "special_ad_categories": [],
            "is_adset_budget_sharing_enabled": False
        })

        # Create AdSet
        adset = account.create_ad_set(params={
            "name": payload["adset"]["name"],
            "campaign_id": campaign["id"],
            "daily_budget": payload["adset"]["daily_budget"],
            "billing_event": payload["adset"]["billing_event"],
            "optimization_goal": payload["adset"]["optimization_goal"],
            "bid_amount": 100,
            "targeting": payload["adset"]["targeting"],
            "start_time": payload["adset"]["start_time"],
            "end_time": payload["adset"]["end_time"],
            "status": "PAUSED"
        })

        # Create creative
        creative = account.create_ad_creative(params={
            "name": "AI Creative",
            "object_story_spec": {
                "page_id": creds["page_id"],
                "link_data": {
                    "image_hash": image_hash,
                    "link": payload["creative"]["landing_url"],
                    "message": payload["creative"]["descriptions"][0],
                    "name": payload["creative"]["headline"],
                    "call_to_action": {"type": payload["creative"]["call_to_action"]}
                }
            }
        })

        # Create Ad
        ad = account.create_ad(params={
            "name": campaign_name,
            "adset_id": adset["id"],
            "creative": {"creative_id": creative["id"]},
            "status": "PAUSED"
        })

        # ✅ Success
        return {
            "status": "success",
            "campaign_id": campaign["id"],
            "adset_id": adset["id"],
            "creative_id": creative["id"],
            "ad_id": ad["id"],
            "image_hash": image_hash
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }
