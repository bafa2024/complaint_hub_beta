# backend/app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from app.utils import get_password_hash  # Changed from hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)  # This now uses the correct function
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed,
        is_active=True,
        is_brand=False,
        is_admin=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_ticket(db: Session, ticket: schemas.TicketCreate):
    db_ticket = models.Ticket(
        brand_id=ticket.brand_id,
        user_id=ticket.user_id,
        channel=ticket.channel,
        description=ticket.description,
        category=ticket.category,
        status="new"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket(db: Session, ticket_id: int):
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()

def list_tickets(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Ticket).offset(skip).limit(limit).all()