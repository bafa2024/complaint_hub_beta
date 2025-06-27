from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import webhook, tickets, analytics, auth, brands
from app.database import engine
from app.db.base_class import Base
from app.models import User, Brand, Ticket  # Import all models
from dotenv import load_dotenv
load_dotenv()  # reads .env into os.environ

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Complaint Hub API v1")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://complaint-hub-beta.onrender.com", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(brands.router, prefix="/api/v1/brands", tags=["brands"])  # Add brand routes
app.include_router(webhook.router, prefix="/api/v1/webhook", tags=["webhook"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
def root():
    return {"status": "API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}