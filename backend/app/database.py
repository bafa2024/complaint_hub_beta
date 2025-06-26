# backend/app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import your Base so create_all() (if you call it) knows about it
from app.db.base_class import Base

# Pick up DATABASE_URL from env (set this in Render / .env)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./test.db"  # fallback for local dev
)

# For SQLite only: disable thread check
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Optional: create tables (call this once at startup if you want)
# Base.metadata.create_all(bind=engine)

def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy Session,
    then closes it when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
