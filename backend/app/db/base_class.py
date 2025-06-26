# backend/app/db/base_class.py

from sqlalchemy.ext.declarative import declarative_base

# This is your SQLAlchemy Base class that models.py expects
Base = declarative_base()
