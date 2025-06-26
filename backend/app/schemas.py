# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ─────────────────────────────────────────────────────────────────────────────
# User schemas
# ─────────────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    is_brand: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True  # <-- replaces orm_mode in Pydantic V2

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ─────────────────────────────────────────────────────────────────────────────
# Ticket schemas
# ─────────────────────────────────────────────────────────────────────────────

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
        from_attributes = True
