import os
from fastapi import FastAPI, APIRouter, HTTPException,Form,Depends
from fastapi.responses import HTMLResponse

from passlib.context import CryptContext
from pymongo import MongoClient
from fastapi import Body
from datetime import datetime, timedelta
from pydantic import BaseModel
from dotenv import load_dotenv
from auth.security import hash_password, verify_password, create_access_token
from auth.email import generate_email_token, send_email, confirm_email_token
from auth.dependencies import get_current_user

# ----------------- Setup -----------------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ads_agent_db")
DATABASE_NAME = os.getenv("DATABASE_NAME")
if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is missing")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD ="password123"  # can set in .env

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db["users"]

router = APIRouter()

# ----------------- Admin Bootstrap -----------------
def create_admin():
    existing_admin = user_collection.find_one({"email": ADMIN_EMAIL})
    if existing_admin:
        print("Admin already exists")
        return

    hashed_pw = pwd_context.hash(ADMIN_PASSWORD)
    user_collection.insert_one({
        "email": ADMIN_EMAIL,
        "hashed_password": hashed_pw,
        "is_active": True,
        "is_admin": True
    })
    print(f"Admin created: {ADMIN_EMAIL}")

create_admin()

# ----------------- Routes -----------------
@router.post("/signup")
async def signup(email: str=Form(...), password: str=Form(...)):
    if user_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(password[:72])
    user_collection.insert_one({
        "email": email,
        "hashed_password": hashed_pw,
        "is_active": False,
        "is_admin": False
    })

    token = generate_email_token(email)
    verify_link = f"http://localhost:8000/user/verify/{token}"
    send_email(email, "Verify your email", f"<p>Click to verify your email: <a href='{verify_link}'>{verify_link}</a></p>")

    return {"msg": "Check your email for verification"}

@router.get("/verify/{token}")
async def verify_email(token: str):
    email = confirm_email_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user_collection.update_one({"email": email}, {"$set": {"is_active": True}})
    return {"msg": "Email verified successfully"}

@router.post("/login")
async def login(email: str=Form(...), password: str=Form(...)):
    user = user_collection.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not user.get("is_active", False):
        raise HTTPException(status_code=400, detail="Email not verified")

    token = create_access_token({
        "sub": email,
        "is_admin": user.get("is_admin", False)
    })

    return {"access_token": token}






# # ----------------- Forgot Password -----------------
@router.post("/forgot-password")
async def forgot_password(email: str = Body(..., embed=True)):
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # Generate a token valid for 1 hour (3600 seconds)
    token = generate_email_token(email)
    reset_link = f"http://localhost:8000/user/reset-password/{token}"

    send_email(
        email,
        "Password Reset Request",
        f"<p>Click the link below to reset your password:</p>"
        f"<p><a href='{reset_link}'>{reset_link}</a></p>"
        "<p>If you did not request this, ignore this email.</p>"
    )

    return {"msg": "Password reset email sent. Check your inbox."}





# GET route: serve reset password form
@router.get("/reset-password/{token}", response_class=HTMLResponse)
async def reset_password_form(token: str):
    email = confirm_email_token(token, expiration=3600)
    if not email:
        return HTMLResponse("<h3>Invalid or expired link</h3>", status_code=400)
    
    # Simple HTML form
    return f"""
    <html>
    <body>
        <h3>Reset Password for {email}</h3>
        <form action="/user/reset-password/{token}" method="post">
            <label>New Password:</label><br>
            <input type="password" name="new_password" required><br><br>
            <button type="submit">Reset Password</button>
        </form>
    </body>
    </html>
    """

# POST route: update password

@router.post("/reset-password/{token}")
async def reset_password_submit(token: str, new_password: str = Form(...)):
    email = confirm_email_token(token, expiration=3600)
    if not email:
        return HTMLResponse("<h3>Invalid or expired link</h3>", status_code=400)
    
    hashed_pw = pwd_context.hash(new_password[:72])
    user_collection.update_one({"email": email}, {"$set": {"hashed_password": hashed_pw}})
    
    return HTMLResponse("<h3>Password updated successfully!</h3>")





@router.get("/me")
async def me(user=Depends(get_current_user)):
    user["_id"] = str(user["_id"])
    user.pop("hashed_password", None)
    return user
