# backend/app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from app.utils import get_password_hash
import logging

# Set up logging
logger = logging.getLogger(__name__)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    logger.info(f"Creating user with email: {user.email}")
    
    try:
        hashed = get_password_hash(user.password)
        db_user = models.User(
            name=user.name,
            email=user.email,
            phone=user.phone,
            hashed_password=hashed,
            is_active=True,
            is_brand=False,
            is_admin=False
        )
        
        logger.info(f"Adding user to session: {db_user.email}")
        db.add(db_user)
        
        logger.info("Flushing to database...")
        db.flush()  # Force write to database
        
        logger.info("Committing to database...")
        db.commit()
        
        logger.info(f"Refreshing user object...")
        db.refresh(db_user)
        
        logger.info(f"User created successfully with ID: {db_user.id}")
        
        # Double-check by querying
        check_user = db.query(models.User).filter(models.User.id == db_user.id).first()
        if check_user:
            logger.info(f"✓ Verified: User exists in DB with ID {check_user.id}")
        else:
            logger.error(f"✗ ERROR: User not found after creation!")
        
        return db_user
        
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        db.rollback()
        raise

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