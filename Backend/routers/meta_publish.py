# routers/meta_router.py
from fastapi import APIRouter, Depends, HTTPException, Header, Form, UploadFile, File
import os, shutil, uuid
from graph.pipeline import compiled_pipeline
from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME
from auth.security import decode_access_token

router = APIRouter()

# Database
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db["users"]

# Auth Dependency
def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = user_collection.find_one({"email": payload["sub"]})
    if not user or not user.get("is_active"):
        raise HTTPException(status_code=403, detail="User not active or not found")

    return user



# routers/meta_router.py
from fastapi import APIRouter, Depends, HTTPException, Header, Form, UploadFile, File
import os, shutil, uuid
from graph.pipeline import compiled_pipeline
from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME
from auth.security import decode_access_token
from datetime import datetime

router = APIRouter()

# Database
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db["users"]
campaign_collection = db["campaigns"]  # collection to store campaigns

# Auth Dependency
def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = user_collection.find_one({"email": payload["sub"]})
    if not user or not user.get("is_active"):
        raise HTTPException(status_code=403, detail="User not active or not found")

    return user

# Authenticated Route
# @router.post("/publish-meta-ads")
# async def publish_meta_ads(
#     account_id: str = Form(...),
#     access_token: str = Form(...),
#     page_id: str = Form(...),
#     page_name: str = Form(...),  # page name
#     campaign_name: str = Form(...),
#     budget: int = Form(...),
#     location: str = Form(...),
#     start_time: str = Form(...),
#     end_time: str = Form(...),
#     landing_url: str = Form(...),
#     file: UploadFile = File(...),
#     user=Depends(get_current_user)
# ):
#     # Save uploaded image
#     os.makedirs("tmp", exist_ok=True)
#     image_path = f"tmp/{uuid.uuid4()}.jpg"
#     with open(image_path, "wb") as f:
#         shutil.copyfileobj(file.file, f)

#     # Build initial state
#     state = {
#         "platform": "meta",
#         "image_path": image_path,
#         "credentials": {
#             "account_id": account_id,
#             "access_token": access_token,
#             "page_id": page_id
#         },
#         "campaign_config": {
#             "campaign_name": campaign_name,
#             "budget_cents": budget * 100,
#             "location": location,
#             "start_time": start_time,
#             "end_time": end_time,
#             "landing_url": landing_url
#         },
#         "ads": {
#             "meta": {
#                 "headlines": [campaign_name],
#                 "descriptions": [f"Get the best results with our product at {landing_url}"]
#             }
#         },
#         "scored_keywords": {}
#     }

#     # Invoke pipeline
#     final_state = compiled_pipeline.invoke(state)

#     # Meta-specific outputs
#     # meta_publish_result = final_state.get("publish_results", {}).get("meta", {})
#     meta_publish_result = final_state.get("publish_results", {}).get("meta", {})

#     # status = "failed"
#     # if isinstance(meta_publish_result, dict) and meta_publish_result.get("status") == "success":
#     #     status = "completed"

#     meta_compliance = final_state.get("compliance_results", {}).get("meta", {})
#     meta_quality = final_state.get("quality_results", {}).get("platform_scores", {}).get("meta", {})

#     # Ads preview
#     published_meta = final_state.get("packaged_payloads", {}).get("meta", {}).get("creative", {})
#     ads_preview = {
#         "headline": published_meta.get("headline", ""),
#         "description": published_meta.get("descriptions", [])[0] if published_meta.get("descriptions") else ""
#     }

#     # Save campaign to DB
#     campaign_doc = {
#         "user_email": user["email"],
#         "page_id": page_id,
#         "page_name": page_name,
#         "campaign_name": campaign_name,
#         "meta_publish_result": meta_publish_result,
#         "ads_preview": ads_preview,
#         "compliance": meta_compliance,
#         "quality": meta_quality,
#         "created_at": datetime.utcnow()
#     }
#     campaign_collection.insert_one(campaign_doc)

#     return {
#         "status": "success",
#         "campaign_name": campaign_name,
#         "meta_publish_result": meta_publish_result,
#         "ads_preview": ads_preview,
#         "compliance": meta_compliance,
#         "quality": meta_quality
#     }



@router.post("/publish-meta-ads")
async def publish_meta_ads(
    account_id: str = Form(...),
    access_token: str = Form(...),
    page_id: str = Form(...),
    page_name: str = Form(...),
    campaign_name: str = Form(...),
    budget: int = Form(...),
    location: str = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    landing_url: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    try:
        # Validate inputs
        if budget <= 0:
            return {"status": "failed", "error": "Budget must be greater than 0"}
        if not all([account_id, access_token, page_id, page_name, campaign_name, location, start_time, end_time, landing_url, file]):
            return {"status": "failed", "error": "Missing required input(s)"}

        # Save uploaded image
        os.makedirs("tmp", exist_ok=True)
        image_path = f"tmp/{uuid.uuid4()}.jpg"
        with open(image_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Build initial state
        state = {
            "platform": "meta",
            "image_path": image_path,
            "credentials": {
                "account_id": account_id,
                "access_token": access_token,
                "page_id": page_id
            },
            "campaign_config": {
                "campaign_name": campaign_name,
                "budget_cents": budget * 100,
                "location": location,
                "start_time": start_time,
                "end_time": end_time,
                "landing_url": landing_url
            },
            "ads": {
                "meta": {
                    "headlines": [campaign_name],
                    "descriptions": [f"Get the best results with our product at {landing_url}"]
                }
            },
            "scored_keywords": {}
        }

        # Invoke pipeline
        final_state = compiled_pipeline.invoke(state)

        meta_publish_result = final_state.get("publish_results", {}).get("meta", {})
        published_meta = final_state.get("packaged_payloads", {}).get("meta", {}).get("creative", {})

        ads_preview = {
            "headline": published_meta.get("headline", ""),
            "description": published_meta.get("descriptions", [])[0] if published_meta.get("descriptions") else ""
        }

        final_keywords= final_state.get("final_keywords",
        {
            "primary":[],
            "secondary":[],
            "long_tail":[]
        })

        # Save campaign to DB
        campaign_collection.insert_one({
            "user_email": user["email"],
            "platform":"meta",
            "page_id": page_id,
            "page_name": page_name,
            "campaign_name": campaign_name,
            "meta_publish_result": meta_publish_result,
            "ads_preview": ads_preview,
            "keywords": final_keywords,
            "compliance": final_state.get("compliance_results", {}).get("meta", {}),
            "quality": final_state.get("quality_results", {}).get("platform_scores", {}).get("meta", {}),
            "created_at": datetime.utcnow()
        })

        # Check if the publish_result is empty -> failed
        meta_publish_result = final_state.get("publish_results", {}).get("meta", {})

        # Only fail if status == failed
        if meta_publish_result.get("status") == "failed":
            return {
                "status": "failed",
                "error": meta_publish_result.get("error", "Meta API failed")
            }

        return {
            "status": "success",
            "campaign_name": campaign_name,
            "meta_publish_result": meta_publish_result,
            "ads_preview": ads_preview,
            "keywords":final_keywords,
            "compliance": final_state.get("compliance_results", {}).get("meta", {}),
            "quality": final_state.get("quality_results", {}).get("platform_scores", {}).get("meta", {})
        }

    except Exception as e:
        # Catch **any** unexpected error and return failed
        return {"status": "failed", "error": str(e)}






@router.get("/my-meta-campaigns")
async def get_user_meta_campaigns(user=Depends(get_current_user)):
    campaigns = list(
        campaign_collection.find(
            {"user_email": user["email"], "platform": "meta"},
            {"_id": 0}
        ).sort("created_at", -1)
    )
    return {"campaigns": campaigns}



# Route to fetch all campaigns for the current user
@router.get("/my-campaigns")
async def get_user_campaigns(user=Depends(get_current_user)):
    campaigns = list(campaign_collection.find({"user_email": user["email"]}, {"_id": 0}))
    return {"campaigns": campaigns}
