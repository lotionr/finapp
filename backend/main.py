from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db, DB
from models import User, Portfolio, FinancialGoal
from schemas import (
    UserCreate, UserResponse,
    PortfolioCreate, PortfolioResponse, PortfolioUpdate,
    FinancialGoalCreate, FinancialGoalResponse,
    AssetAllocationRequest, AssetAllocationResponse,
    FinancialPlanRequest, FinancialPlanResponse
)
from services.portfolio_service import PortfolioService
from services.plan_service import PlanService
from services.ml_service import MLService

load_dotenv()

app = FastAPI(title="Financial Planning API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Financial Planning API", "version": "1.0.0"}


@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate, db: DB = Depends(get_db)):
    """Create a new user profile"""
    # Check if email already exists
    existing = db.get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        name=user.name,
        email=user.email,
        age=user.age,
        current_income=user.current_income,
        current_savings=user.current_savings,
        risk_profile=user.risk_profile
    )
    created_user = db.create_user(db_user)
    return created_user


@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: DB = Depends(get_db)):
    """Get user profile by ID"""
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/users/email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: DB = Depends(get_db)):
    """Get user profile by email"""
    user = db.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/portfolio/analyze", response_model=AssetAllocationResponse)
def analyze_portfolio(request: AssetAllocationRequest, db: DB = Depends(get_db)):
    """Analyze user inputs and generate asset allocation recommendation"""
    # Get user
    user = db.get_user(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Use portfolio service to generate allocation
    portfolio_service = PortfolioService()
    allocation = portfolio_service.generate_allocation(
        user=user,
        goals=request.goals,
        time_horizon=request.time_horizon
    )
    
    return allocation


@app.get("/api/portfolio/{user_id}", response_model=PortfolioResponse)
def get_portfolio(user_id: int, db: DB = Depends(get_db)):
    """Get user's current portfolio"""
    portfolio = db.get_portfolio_by_user_id(user_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio


@app.put("/api/portfolio/{user_id}", response_model=PortfolioResponse)
def update_portfolio(user_id: int, update: PortfolioUpdate, db: DB = Depends(get_db)):
    """Update user's portfolio allocation"""
    portfolio = Portfolio(
        user_id=user_id,
        allocation=update.allocation
    )
    
    updated_portfolio = db.update_portfolio(user_id, portfolio)
    return updated_portfolio


@app.post("/api/plan/generate", response_model=FinancialPlanResponse)
async def generate_plan(request: FinancialPlanRequest, db: DB = Depends(get_db)):
    """Generate financial plan summary using OpenAI"""
    # Get user
    user = db.get_user(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get portfolio
    portfolio = db.get_portfolio_by_user_id(request.user_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Generate plan using OpenAI
    plan_service = PlanService()
    plan_summary = await plan_service.generate_plan(
        user=user,
        portfolio=portfolio,
        goals=request.goals
    )
    
    return FinancialPlanResponse(summary=plan_summary)


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", 8000)))
