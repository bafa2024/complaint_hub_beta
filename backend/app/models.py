from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_brand = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    tickets = relationship("Ticket", back_populates="user")


class Brand(Base):
    __tablename__ = "brands"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    support_email = Column(String)
    phone_number = Column(String)
    phone_provider = Column(String)
    credit_balance = Column(Float, default=0.0)
    credits_updated_at = Column(DateTime, default=datetime.utcnow)
    auto_routing_enabled = Column(Boolean, default=False)
    routing_rules = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tickets = relationship("Ticket", back_populates="brand")


class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    channel = Column(String)
    description = Column(Text)
    category = Column(String)
    status = Column(String, default="new")
    urgency = Column(Integer, default=1)
    sentiment_score = Column(Float, default=0)
    abuse_level = Column(Integer, default=0)
    assigned_to = Column(Integer, nullable=True)
    audio_file_path = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    rating_comment = Column(Text, nullable=True)
    rated_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    resolution_time_hours = Column(Float, nullable=True)
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    charge_applied = Column(Boolean, default=False)
    charge_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="tickets")
    user = relationship("User", back_populates="tickets")