from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uvicorn

app = FastAPI(title="Pricing API", version="1.0.0")

# Pydantic models
class PricingPlan(BaseModel):
    id: int
    name: str
    price: str
    period: str
    features: List[str]

class LeadCreate(BaseModel):
    email: EmailStr = Field(..., example="user@example.com")

class LeadResponse(BaseModel):
    message: str
    email: str

# Sample data
pricing_plans = [
    PricingPlan(
        id=1,
        name="Starter",
        price="$19",
        period="per month",
        features=[
            "Up to 5 projects",
            "3GB storage",
            "Basic support",
            "Community access"
        ]
    ),
    PricingPlan(
        id=2,
        name="Professional",
        price="$49",
        period="per month",
        features=[
            "Unlimited projects",
            "10GB storage",
            "Priority support",
            "Advanced analytics",
            "Team collaboration"
        ]
    ),
    PricingPlan(
        id=3,
        name="Enterprise",
        price="$99",
        period="per month",
        features=[
            "Unlimited projects",
            "50GB storage",
            "24/7 dedicated support",
            "Advanced analytics",
            "Team collaboration",
            "Custom integrations"
        ]
    )
]

# Routes
@app.get("/api/pricing", response_model=List[PricingPlan])
async def get_pricing_plans():
    return pricing_plans

@app.post("/api/leads", response_model=LeadResponse, status_code=201)
async def create_lead(lead: LeadCreate):
    # In a real application, you would save the lead to a database
    return LeadResponse(
        message="Lead created successfully",
        email=lead.email
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)