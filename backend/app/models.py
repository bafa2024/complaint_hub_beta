# backend/app/models/brand.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime

class Brand(Base):
    __tablename__ = "brands"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    support_email = Column(String)
    phone_number = Column(String)
    phone_provider = Column(String)  # twilio, knowlarity, etc.
    
    # Credit system
    credit_balance = Column(Float, default=0.0)
    credits_updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Settings
    auto_routing_enabled = Column(Boolean, default=False)
    routing_rules = Column(String)  # JSON string of rules
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tickets = relationship("Ticket", back_populates="brand")
    users = relationship("BrandUser", back_populates="brand")
    transactions = relationship("CreditTransaction", back_populates="brand")
    integrations = relationship("BrandIntegration", back_populates="brand")


# backend/app/models/brand_user.py
class BrandUser(Base):
    __tablename__ = "brand_users"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="agent")  # admin, manager, agent
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="users")
    assigned_tickets = relationship("Ticket", back_populates="assigned_to")


# backend/app/models/credit_transaction.py
class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    amount = Column(Float)
    type = Column(String)  # credit, debit
    description = Column(String)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)
    balance_after = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="transactions")
    ticket = relationship("Ticket")


# backend/app/models/ticket_response.py
class TicketResponse(Base):
    __tablename__ = "ticket_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    is_from_brand = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="responses")
    user = relationship("User")


# backend/app/models/ticket_log.py
class TicketLog(Base):
    __tablename__ = "ticket_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)  # status_change, assignment, response, etc.
    details = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    ticket = relationship("Ticket")
    user = relationship("User")


# backend/app/models/brand_integration.py
class BrandIntegration(Base):
    __tablename__ = "brand_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    type = Column(String)  # salesforce, zoho, freshworks, etc.
    api_endpoint = Column(String)
    api_key = Column(String)  # Encrypted
    settings = Column(String)  # JSON configuration
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="integrations")


# Update the existing Ticket model to include new fields
# backend/app/models/ticket.py (additions)
class Ticket(Base):
    # ... existing fields ...
    
    # New fields
    brand_id = Column(Integer, ForeignKey("brands.id"))
    assigned_to_id = Column(Integer, ForeignKey("brand_users.id"), nullable=True)
    
    # Voice complaint
    audio_file_path = Column(String, nullable=True)
    
    # Rating system
    rating = Column(Integer, nullable=True)  # 0-5
    rating_comment = Column(Text, nullable=True)
    rated_at = Column(DateTime, nullable=True)
    
    # Resolution tracking
    resolved_at = Column(DateTime, nullable=True)
    resolution_time_hours = Column(Float, nullable=True)
    
    # Public visibility
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    
    # Billing
    charge_applied = Column(Boolean, default=False)
    charge_amount = Column(Float, nullable=True)
    
    # Relationships
    brand = relationship("Brand", back_populates="tickets")
    assigned_to = relationship("BrandUser", back_populates="assigned_tickets")
    responses = relationship("TicketResponse", back_populates="ticket")
    logs = relationship("TicketLog", back_populates="ticket")