
from fastapi import APIRouter, Depends, HTTPException, Header
from pymongo import MongoClient
from bson import ObjectId
from config import MONGO_URI, DATABASE_NAME
from auth.security import decode_access_token

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db["users"]

router = APIRouter()

def get_current_admin(authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or not payload.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    return payload

def serialize_user(user):
    """Convert ObjectId to string for JSON serialization."""
    user["_id"] = str(user["_id"])
    return user

@router.get("/users")
async def get_all_users(admin=Depends(get_current_admin)):
    users = list(user_collection.find({}, {"hashed_password": 0}))
    users = [serialize_user(user) for user in users]
    return users

@router.delete("/user/{email}")
async def delete_user(email: str, admin=Depends(get_current_admin)):
    user_collection.delete_one({"email": email})
    return {"msg": f"User {email} deleted"}
