from fastapi import Depends, HTTPException, Header
from pymongo import MongoClient
from auth.security import decode_access_token
from config import MONGO_URI, DATABASE_NAME
import certifi

client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

db = client[DATABASE_NAME]
user_collection = db["users"]


def get_bearer_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return authorization.split(" ")[1]


def get_current_user(token: str = Depends(get_bearer_token)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = user_collection.find_one({"email": payload["sub"]})
    if not user:
        raise HTTPException(status_code=403, detail="User not found")

    return user


def get_current_admin(user: dict = Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
