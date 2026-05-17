

####################################################################################################################################

from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, Header
from datetime import datetime
import os, uuid, shutil
from pymongo import MongoClient
from graph.nodes.google_publisher_node import google_publish_node
# from google_ads_file import publish_google_ads_api
from google.ads.googleads.errors import GoogleAdsException


from graph.pipeline import compiled_pipeline
from auth.security import decode_access_token
from config import MONGO_URI, DATABASE_NAME

router = APIRouter()

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db["users"]
campaign_collection = db["campaigns"]


def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_collection.find_one({"email": payload["sub"]})
    if not user:
        raise HTTPException(status_code=403, detail="User not found")

    return user




##############################################################################################################################

@router.post("/publish-google-ads")
async def publish_google_ads(
    developer_token: str = Form(...),
    client_id: str = Form(...),
    client_secret: str = Form(...),
    refresh_token: str = Form(...),
    customer_id: str = Form(...),
    campaign_name: str = Form(...),
    budget_micros: int = Form(...),
    landing_url: str = Form(...),
    target_region: str = Form(...),  # NEW
    file: UploadFile = File(...),
    login_customer_id: str = Form(None),
    user=Depends(get_current_user)
):
    """
    Creates Google Ads campaign with proper error handling.
    """
    import os, shutil, uuid, traceback
    from fastapi import HTTPException

    # Convert small budget from dollars → micros
    processed_budget = budget_micros * 1_000_000 if budget_micros < 10000 else budget_micros
    if processed_budget < 1_000_000:
        raise HTTPException(
            status_code=400, 
            detail=f"Budget too low: {processed_budget} micros. Minimum is 1,000,000 micros ($1.00)"
        )

    # Save uploaded image
    os.makedirs("tmp", exist_ok=True)
    image_path = f"tmp/{uuid.uuid4()}.jpg"
    try:
        with open(image_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to save image: {str(e)}")

    # Build state
    state = {
        "platform": "google",
        "image_path": image_path,
        "credentials": {
            "developer_token": developer_token,
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "customer_id": customer_id,
            "login_customer_id": login_customer_id,
        },
        "campaign_config": {
            "campaign_name": campaign_name,
            "budget_micros": processed_budget,
            "landing_url": landing_url,
            "target_region": target_region
        },
        "target_region": target_region
    }

    # Run pipeline with GoogleAdsException handling
    final_state = state
    # try:
    #     print("[API] Starting Google Ads pipeline...")
    #     final_state = compiled_pipeline.invoke(state)
    #     print("[API] Pipeline completed successfully")
    # except Exception as e:
    #     print(f"[API] Pipeline failed: {e}")
    #     traceback.print_exc()
    #     # Detect GoogleAdsException specifically
    #     from google.ads.googleads.errors import GoogleAdsException
    #     errors = []
    #     if isinstance(e, GoogleAdsException):
    #         for err in e.failure.errors:
    #             error_info = {"message": err.message, "field": [f.field_name for f in (err.location.field_path_elements or [])]}
    #             errors.append(error_info)
    #     else:
    #         errors.append({"message": str(e)})

    #     final_state.setdefault("publish_results", {})
    #     final_state["publish_results"]["google"] = {
    #         "status": "failed",
    #         "errors": errors
    #     }


    # try:
    #     print("[API] Starting Google Ads pipeline...")
    #     final_state = compiled_pipeline.invoke(state)
    #     print("[API] Pipeline completed successfully")
        
    #     # Mark Google publish as success
    #     final_state.setdefault("publish_results", {})
    #     final_state["publish_results"]["google"] = {
    #         "status": "success",
    #         "errors": []
    #     }

    # except Exception as e:
    #     print(f"[API] Pipeline failed: {e}")
    #     traceback.print_exc()
    #     from google.ads.googleads.errors import GoogleAdsException
    #     errors = []
    #     if isinstance(e, GoogleAdsException):
    #         for err in e.failure.errors:
    #             error_info = {"message": err.message, "field": [f.field_name for f in (err.location.field_path_elements or [])]}
    #             errors.append(error_info)
    #     else:
    #         errors.append({"message": str(e)})

    #     final_state.setdefault("publish_results", {})
    #     final_state["publish_results"]["google"] = {
    #         "status": "failed",
    #         "errors": errors
    #     }

    try:
        final_state = compiled_pipeline.invoke(state)

        # Mark success
        final_state.setdefault("publish_results", {})
        final_state["publish_results"]["google"] = {"status": "success", "errors": []}

    except ValueError as ve:
        # Check if it came from GoogleAdsException
        err_data = ve.args[0] if isinstance(ve.args[0], dict) else {"message": str(ve)}
        final_state.setdefault("publish_results", {})
        final_state["publish_results"]["google"] = err_data

    except Exception as e:
        final_state.setdefault("publish_results", {})
        final_state["publish_results"]["google"] = {
            "status": "failed",
            "errors": [{"message": str(e)}]
        }

    # Extract result
    result = final_state.get("publish_results", {}).get("google", {})
    if not result.get("status"):
        result["status"] = "failed"
        result.setdefault("errors", [{"message": "Unknown error - no status returned"}])

    # Prepare ad preview
    ad_payload = final_state.get("packaged_payloads", {}).get("google", {})
    rsa = ad_payload.get("responsive_search_ad", {})
    preview = {
        "headline": rsa.get("headlines", [""])[0] if rsa.get("headlines") else "",
        "description": rsa.get("descriptions", [""])[0] if rsa.get("descriptions") else "",
        "landing_url": landing_url,
        "all_headlines": rsa.get("headlines", []),
        "all_descriptions": rsa.get("descriptions", [])
    }

    # Save campaign to database
    # campaign_doc = {
    #     "user_email": user["email"],
    #     "platform": "google",
    #     "campaign_name": campaign_name,
    #     "budget_micros": processed_budget,
    #     "status": result.get("status"),
    #     "result": result,
    #     "preview": preview,
    #     "created_at": datetime.utcnow()
    # }
    # try:
    #     campaign_collection.insert_one(campaign_doc)
    #     print("[API] Campaign saved to database")
    # except Exception as e:
    #     print(f"[API] Failed to save to DB: {e}")

    if result.get("status") == "success":
        campaign_doc = {
            "user_email": user["email"],
            "platform": "google",
            "campaign_name": campaign_name,
            "budget_micros": processed_budget,
            "status": result.get("status"),
            "result": result,
            "preview": preview,
            "created_at": datetime.utcnow()
        }
        try:
            campaign_collection.insert_one(campaign_doc)
            print("[API] Campaign saved to database")
        except Exception as e:
            print(f"[API] Failed to save to DB: {e}")
    else:
        print("[API] Campaign not saved to DB because publishing failed")

    # Cleanup temp image
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print(f"[API] Failed to cleanup temp file: {e}")

    # error_message = None

    # if result.get("status") == "failed":
    #     errors = result.get("errors", [])
    #     if errors:
    #         error_message = errors[0].get("message", "Google Ads error")

    return {
        "status": result.get("status"),
        "campaign_name": campaign_name,
        "budget_micros": processed_budget,
        # "error": error_message,  # ✅ IMPORTANT

        "google_publish_result": result,
        "ads_preview": preview,
    }






@router.get("/my-google-campaigns")
async def get_user_campaigns(user=Depends(get_current_user)):
    """
    Retrieves user's Google Ads campaigns.
    """
    campaigns = list(
        campaign_collection.find(
            {"user_email": user["email"], "platform": "google"},
            {"_id": 0}
        ).sort("created_at", -1)
    )
    return {"campaigns": campaigns}








