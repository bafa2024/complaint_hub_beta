from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    is_brand: bool
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TicketCreate(BaseModel):
    brand_id: int
    user_id: Optional[int]
    channel: str
    description: str
    category: str

class TicketOut(BaseModel):
    id: int
    brand_id: int
    user_id: Optional[int]
    channel: str
    description: str
    status: str
    sentiment_score: float
    urgency: int
    abuse_level: int
    category: str
    assigned_to: Optional[int]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        orm_mode = True
