# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# === Temporarily disable Sentry until you install sentry-sdk ===
# import sentry_sdk
# from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
# sentry_sdk.init(dsn=settings.SENTRY_DSN)

from app.core.config import settings  # <— make sure this points to your settings module

# Celery for background tasks
from celery import Celery

celery_app = Celery(
    "complainthub",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

@celery_app.task
def send_follow_up_call(ticket_id: int):
    # Your follow-up call logic here
    pass

# Create FastAPI app
app = FastAPI(title="Complaint Hub API v1")

# Add CORS (adjust to your Render static site URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://<your-frontend>.onrender.com"  # ← replace with your actual Render URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === If/when you install sentry-sdk, re-enable these: ===
# app.add_middleware(SentryAsgiMiddleware)

# Import and mount your routers AFTER middleware
from app.api.v1.routes import webhook, tickets, analytics, auth

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(webhook.router, prefix="/api/v1/webhook", tags=["webhook"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])


@app.get("/")
def root():
    return {"status": "API is running"}
