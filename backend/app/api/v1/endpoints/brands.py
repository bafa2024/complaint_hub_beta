# backend/app/api/v1/endpoints/brands.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.api import deps
from app.models.brand import Brand
from app.models.ticket import Ticket
from app.schemas.brand import BrandCreate, BrandUpdate, BrandDashboard
from app.core.security import get_current_brand_user

router = APIRouter()

@router.post("/auth/brand-login")
async def brand_login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """Brand authentication endpoint"""
    brand_user = authenticate_brand(
        db, email=form_data.username, password=form_data.password
    )
    if not brand_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(
        data={"sub": brand_user.email, "role": "brand", "brand_id": brand_user.brand_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/{brand_id}/dashboard")
async def get_brand_dashboard(
    brand_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_brand_user)
):
    """Get brand dashboard data"""
    # Get complaint statistics
    total_complaints = db.query(Ticket).filter(
        Ticket.brand_id == brand_id,
        Ticket.category == "complaint"
    ).count()
    
    new_complaints = db.query(Ticket).filter(
        Ticket.brand_id == brand_id,
        Ticket.status == "new",
        Ticket.category == "complaint"
    ).count()
    
    # Calculate average rating
    ratings = db.query(Ticket.rating).filter(
        Ticket.brand_id == brand_id,
        Ticket.rating.isnot(None)
    ).all()
    avg_rating = sum(r[0] for r in ratings) / len(ratings) if ratings else 0
    
    # Get urgent tickets (nearing 24h deadline)
    urgent_tickets = db.query(Ticket).filter(
        Ticket.brand_id == brand_id,
        Ticket.status != "resolved",
        Ticket.created_at < datetime.utcnow() - timedelta(hours=20)
    ).limit(10).all()
    
    return {
        "new_complaints": new_complaints,
        "total_active": total_complaints,
        "avg_rating": round(avg_rating, 1),
        "avg_resolution_time": "18h",  # Calculate from data
        "urgent_tickets": urgent_tickets
    }

@router.get("/{brand_id}/credits")
async def get_brand_credits(
    brand_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_brand_user)
):
    """Get brand credit balance"""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return {
        "balance": brand.credit_balance,
        "currency": "INR",
        "last_updated": brand.credits_updated_at
    }

@router.post("/{brand_id}/credits")
async def add_brand_credits(
    brand_id: int,
    amount: float,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_brand_user)
):
    """Add credits to brand account"""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # In production, integrate with payment gateway here
    brand.credit_balance += amount
    brand.credits_updated_at = datetime.utcnow()
    
    # Log transaction
    transaction = CreditTransaction(
        brand_id=brand_id,
        amount=amount,
        type="credit",
        description="Credit top-up",
        balance_after=brand.credit_balance
    )
    db.add(transaction)
    db.commit()
    
    return {"success": True, "new_balance": brand.credit_balance}

@router.post("/{brand_id}/phone-number")
async def generate_phone_number(
    brand_id: int,
    provider: str = "twilio",
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_brand_user)
):
    """Generate toll-free number for brand"""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Integration with telephony provider
    if provider == "twilio":
        # Twilio integration
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Search for available toll-free numbers
        available_numbers = client.available_phone_numbers('US').toll_free.list(
            area_code='800',
            limit=1
        )
        
        if available_numbers:
            # Purchase the number
            number = client.incoming_phone_numbers.create(
                phone_number=available_numbers[0].phone_number,
                voice_url=f"{settings.API_URL}/webhook/voice/{brand_id}"
            )
            
            # Save to database
            brand.phone_number = number.phone_number
            brand.phone_provider = provider
            db.commit()
            
            return {
                "phone_number": number.phone_number,
                "provider": provider,
                "status": "active"
            }
    
    raise HTTPException(status_code=400, detail="Failed to generate phone number")

@router.get("/{brand_id}/analytics")
async def get_brand_analytics(
    brand_id: int,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_brand_user)
):
    """Get brand analytics data"""
    query = db.query(Ticket).filter(Ticket.brand_id == brand_id)
    
    if start_date:
        query = query.filter(Ticket.created_at >= start_date)
    if end_date:
        query = query.filter(Ticket.created_at <= end_date)
    
    tickets = query.all()
    
    # Calculate analytics
    total_tickets = len(tickets)
    resolved_tickets = len([t for t in tickets if t.status == "resolved"])
    
    category_breakdown = {}
    for ticket in tickets:
        category_breakdown[ticket.category] = category_breakdown.get(ticket.category, 0) + 1
    
    channel_breakdown = {}
    for ticket in tickets:
        channel_breakdown[ticket.channel] = channel_breakdown.get(ticket.channel, 0) + 1
    
    # Calculate resolution times
    resolution_times = []
    for ticket in tickets:
        if ticket.status == "resolved" and ticket.resolved_at:
            time_diff = (ticket.resolved_at - ticket.created_at).total_seconds() / 3600
            resolution_times.append(time_diff)
    
    avg_resolution_time = sum(resolution_times) / len(resolution_times) if resolution_times else 0
    
    return {
        "total_tickets": total_tickets,
        "resolved_tickets": resolved_tickets,
        "resolution_rate": (resolved_tickets / total_tickets * 100) if total_tickets > 0 else 0,
        "avg_resolution_time_hours": round(avg_resolution_time, 1),
        "category_breakdown": category_breakdown,
        "channel_breakdown": channel_breakdown,
        "satisfaction_scores": {
            "average": 4.2,  # Calculate from actual ratings
            "total_ratings": 150
        }
    }
