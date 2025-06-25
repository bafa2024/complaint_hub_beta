from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_brand = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    support_email = Column(String)
    toll_free_number = Column(String)
    credits = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    channel = Column(String)
    description = Column(Text)
    status = Column(String, default="new")
    sentiment_score = Column(Float, default=0)
    urgency = Column(Integer, default=0)
    abuse_level = Column(Integer, default=0)
    category = Column(String)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

class ConversationLog(Base):
    __tablename__ = "conversation_logs"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    speaker = Column(String)  # bot/user/brand
    message = Column(Text)
    audio_url = Column(String, nullable=True)
    sentiment_score = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    amount = Column(Float)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)
    type = Column(String)
    message = Column(Text)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
