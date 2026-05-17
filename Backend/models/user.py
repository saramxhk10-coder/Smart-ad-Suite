from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class UserModel(BaseModel):
    id: PyObjectId = None
    email: EmailStr
    hashed_password: Optional[str] = None
    is_active: bool = False
    is_admin: bool = False
