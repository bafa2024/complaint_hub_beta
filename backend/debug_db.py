#!/usr/bin/env python3
"""
Debug script to check database connection and data
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:root@localhost/complaintdb")

print("="*80)
print("DATABASE DEBUG SCRIPT")
print("="*80)
print(f"\nDatabase URL: {DATABASE_URL}")

# Method 1: Using SQLAlchemy (same as your app)
print("\n--- METHOD 1: SQLAlchemy (same as your app) ---")
try:
    engine = create_engine(DATABASE_URL, echo=True)  # echo=True shows SQL queries
    
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(text("SELECT current_database()"))
        current_db = result.scalar()
        print(f"✓ Connected to database: {current_db}")
        
        # Check if users table exists
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"\nTables in database: {tables}")
        
        if 'users' in tables:
            print("\n✓ 'users' table exists")
            
            # Get table structure
            columns = inspector.get_columns('users')
            print("\nUsers table structure:")
            for col in columns:
                print(f"  - {col['name']}: {col['type']}")
            
            # Count users
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            print(f"\nTotal users in table: {count}")
            
            # Get all users
            result = conn.execute(text("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5"))
            users = result.fetchall()
            
            if users:
                print("\nLatest 5 users:")
                for user in users:
                    print(f"  ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Created: {user[3]}")
            else:
                print("\nNo users found in the table!")
        else:
            print("\n✗ 'users' table does NOT exist!")
            
except Exception as e:
    print(f"\n✗ SQLAlchemy Error: {e}")

# Method 2: Direct psycopg2 (to double-check)
print("\n\n--- METHOD 2: Direct psycopg2 ---")
try:
    # Parse connection string
    if DATABASE_URL.startswith("postgresql+psycopg2://"):
        url = DATABASE_URL.replace("postgresql+psycopg2://", "")
    else:
        url = DATABASE_URL.replace("postgresql://", "")
    
    # Extract components
    auth, host_db = url.split('@')
    user, password = auth.split(':')
    host_port, db = host_db.split('/')
    
    if ':' in host_port:
        host, port = host_port.split(':')
    else:
        host = host_port
        port = 5432
    
    print(f"Connecting with: host={host}, database={db}, user={user}")
    
    conn = psycopg2.connect(
        host=host,
        database=db,
        user=user,
        password=password,
        port=port
    )
    
    cur = conn.cursor()
    
    # Check current database
    cur.execute("SELECT current_database()")
    current_db = cur.fetchone()[0]
    print(f"✓ Connected to database: {current_db}")
    
    # Check if users table exists
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        )
    """)
    
    exists = cur.fetchone()[0]
    
    if exists:
        print("\n✓ 'users' table exists")
        
        # Count users
        cur.execute("SELECT COUNT(*) FROM users")
        count = cur.fetchone()[0]
        print(f"\nTotal users: {count}")
        
        # Get latest users
        cur.execute("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5")
        users = cur.fetchall()
        
        if users:
            print("\nLatest 5 users:")
            for user in users:
                print(f"  ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Created: {user[3]}")
    else:
        print("\n✗ 'users' table does NOT exist!")
        
        # List all tables
        cur.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        print(f"\nTables in database: {[t[0] for t in tables]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"\n✗ psycopg2 Error: {e}")

# Method 3: Test creating a user directly
print("\n\n--- METHOD 3: Test User Creation ---")
try:
    from app.database import SessionLocal
    from app.models import User
    from app.utils import get_password_hash
    from datetime import datetime
    
    db = SessionLocal()
    
    # Create a test user
    test_email = f"test_{datetime.now().timestamp()}@example.com"
    test_user = User(
        name="Test User",
        email=test_email,
        phone="1234567890",
        hashed_password=get_password_hash("testpass"),
        is_active=True,
        is_brand=False,
        is_admin=False
    )
    
    print(f"Creating test user: {test_email}")
    db.add(test_user)
    db.commit()
    
    # Verify it was saved
    saved_user = db.query(User).filter(User.email == test_email).first()
    if saved_user:
        print(f"✓ Test user created successfully with ID: {saved_user.id}")
    else:
        print("✗ Test user was NOT saved!")
    
    db.close()
    
except Exception as e:
    print(f"\n✗ Test creation error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*80)
print("DEBUG COMPLETE")
print("="*80)