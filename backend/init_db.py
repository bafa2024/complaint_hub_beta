from app.database import engine
from app.db.base_class import Base
from app.models import User, Brand, Ticket

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()