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

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/signup", response_model=schemas.UserRead, status_code=201)
def signup(data: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Signup attempt with data: {data.dict()}")
    
    # Check if user already exists
    existing = crud.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user = crud.create_user(db, data)
    logger.info(f"User created successfully: {user.email}")
    
    # Return the created user
    return user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info(f"Login attempt for user: {form_data.username}")
    
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        {"sub": user.email}, expires_delta=expires
    )
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserRead)
def read_me(current_user = Depends(get_current_user)):
    return current_user