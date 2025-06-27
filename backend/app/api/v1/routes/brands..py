# backend/app/api/v1/routes/brands.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from app import crud, schemas
from app.database import get_db
from app.utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from app import models

logger = logging.getLogger(__name__)

router = APIRouter(tags=["brands"])

@router.post("/signup", response_model=schemas.BrandRead, status_code=201)
def brand_signup(data: schemas.BrandCreate, db: Session = Depends(get_db)):
    """Register a new brand"""
    logger.info(f"Brand signup request: {data.email}")
    
    # Check if email already exists in users table
    existing_user = crud.get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if brand name already exists
    existing_brand = db.query(models.Brand).filter(
        models.Brand.name == data.brand_name
    ).first()
    if existing_brand:
        raise HTTPException(status_code=400, detail="Brand name already exists")
    
    try:
        # Create user account for brand
        hashed_password = get_password_hash(data.password)
        db_user = models.User(
            name=data.contact_person,
            email=data.email,
            phone=data.phone,
            hashed_password=hashed_password,
            is_active=True,
            is_brand=True,  # Mark as brand user
            is_admin=False
        )
        db.add(db_user)
        db.flush()  # Get the user ID
        
        # Create brand record
        db_brand = models.Brand(
            name=data.brand_name,
            email=data.email,
            support_email=data.support_email,
            phone_number=data.phone,
            credit_balance=0.0,  # Start with 0 credits
            auto_routing_enabled=False
        )
        db.add(db_brand)
        db.commit()
        
        # Refresh to get the complete objects
        db.refresh(db_user)
        db.refresh(db_brand)
        
        logger.info(f"Brand created successfully: {db_brand.name}")
        
        # Return brand data
        return {
            "id": db_brand.id,
            "name": db_brand.name,
            "email": db_brand.email,
            "support_email": db_brand.support_email,
            "phone_number": db_brand.phone_number,
            "credit_balance": db_brand.credit_balance,
            "auto_routing_enabled": db_brand.auto_routing_enabled,
            "created_at": db_brand.created_at
        }
        
    except Exception as e:
        logger.error(f"Error creating brand: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create brand")

@router.post("/login", response_model=schemas.Token)
def brand_login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """Brand login endpoint"""
    logger.info(f"Brand login attempt: {form_data.username}")
    
    # Find user by email
    user = crud.get_user_by_email(db, form_data.username)
    
    # Verify user exists, is a brand, and password is correct
    if not user or not user.is_brand or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or not a brand account",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Find associated brand
    brand = db.query(models.Brand).filter(models.Brand.email == user.email).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    # Create access token with brand info
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "is_brand": True,
            "brand_id": brand.id
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=schemas.BrandRead)
def get_brand_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current brand's profile"""
    if not current_user.is_brand:
        raise HTTPException(status_code=403, detail="Not a brand account")
    
    brand = db.query(models.Brand).filter(models.Brand.email == current_user.email).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return brand