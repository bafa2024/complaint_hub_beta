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
    is_brand: bool = False
    is_admin: bool = False
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True  # For Pydantic v2 compatibility

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ─────────────────────────────────────────────────────────────────────────────
# Ticket schemas
# ─────────────────────────────────────────────────────────────────────────────

class TicketCreate(BaseModel):
    brand_id: int
    user_id: Optional[int] = None
    channel: str
    description: str
    category: str

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    category: Optional[str] = None

class TicketResponse(BaseModel):
    id: int
    message: str
    created_at: datetime
    user_id: int
    is_from_brand: bool = False

    class Config:
        from_attributes = True

class TicketOut(BaseModel):
    id: int
    brand_id: int
    user_id: Optional[int]
    channel: str
    description: str
    status: str
    sentiment_score: Optional[float] = 0
    urgency: Optional[int] = 1
    abuse_level: Optional[int] = 0
    category: str
    assigned_to: Optional[int] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    rating: Optional[int] = None

    class Config:
        from_attributes = True

# ─────────────────────────────────────────────────────────────────────────────
# Brand schemas
# ─────────────────────────────────────────────────────────────────────────────

class BrandCreate(BaseModel):
    name: str
    email: EmailStr
    support_email: Optional[str] = None
    phone_number: Optional[str] = None

class BrandUpdate(BaseModel):
    name: Optional[str] = None
    support_email: Optional[str] = None
    phone_number: Optional[str] = None
    auto_routing_enabled: Optional[bool] = None
    routing_rules: Optional[str] = None

class BrandRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    support_email: Optional[str]
    phone_number: Optional[str]
    phone_provider: Optional[str]
    credit_balance: float
    auto_routing_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

class BrandDashboard(BaseModel):
    new_complaints: int
    total_active: int
    avg_rating: float
    avg_resolution_time: str

# ─────────────────────────────────────────────────────────────────────────────
# Other schemas
# ─────────────────────────────────────────────────────────────────────────────

class CreditTransaction(BaseModel):
    id: int
    brand_id: int
    amount: float
    type: str
    description: str
    balance_after: float
    created_at: datetime

    class Config:
        from_attributes = True

class PublicComplaint(BaseModel):
    id: int
    brand_name: str
    description: str
    days_unresolved: int
    views: int
    location: str
    created_at: datetime