# import requests

# BASE_URL = "https://graph.facebook.com/v17.0"

# def create_meta_campaign(access_token: str, ad_account_id: str, name: str):
#     url = f"{BASE_URL}/act_{ad_account_id}/campaigns"
#     params = {
#         "name": name,
#         "objective": "CONVERSIONS",
#         "status": "PAUSED",
#         "access_token": access_token
#     }
#     resp = requests.post(url, params=params)
#     return resp.json()
