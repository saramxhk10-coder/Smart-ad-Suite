from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adimage import AdImage


def upload_meta_image(image_path: str, account_id: str, access_token: str):
    FacebookAdsApi.init(access_token=access_token)

    account = AdAccount(f"act_{account_id}")
    image = AdImage(parent_id=account.get_id_assured())

    image[AdImage.Field.filename] = image_path
    image.remote_create()

    return image[AdImage.Field.hash]
