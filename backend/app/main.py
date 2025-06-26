from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
#from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
#
#sentry_sdk.init(dsn=settings.SENTRY_DSN)
#app = SentryAsgiMiddleware(app)
# Use Celery for background tasks
from celery import Celery

celery_app = Celery(
    "complainthub",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

@celery_app.task
def send_follow_up_call(ticket_id: int):
    # Implementation
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All route imports must come AFTER the CORS middleware
from app.api.v1.routes import webhook, tickets, analytics, auth

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(webhook.router, prefix="/api/v1/webhook", tags=["webhook"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])






@app.get("/")
def root():
    return {"status": "API is running"}
