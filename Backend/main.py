
from fastapi import FastAPI,UploadFile, File, HTTPException,Form
from PIL import Image
import io
from typing import Annotated
import shutil
import uuid
import os
from datetime import datetime
from routers import user, admin, meta_publish,google_router
from config import EMAIL_USER,EMAIL_PASSWORD
from graph.pipeline import compiled_pipeline

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FastAPI Auth System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       # local development
        "https://smart-ad-suite.vercel.app",   # your actual frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(meta_publish.router, prefix="/meta", tags=["Meta Ads"])
app.include_router(google_router.router, prefix="/google", tags=["Google Ads"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)



