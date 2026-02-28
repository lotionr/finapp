from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db, DB
from models import User, Portfolio, FinancialGoal
from schemas import (
    UserCreate, UserUpdate, UserResponse, LoginRequest,
    PortfolioCreate, PortfolioResponse, PortfolioUpdate,
    FinancialGoalCreate, FinancialGoalResponse,
    AssetAllocationRequest, AssetAllocationResponse,
    FeasibilityRequest, FeasibilityResponse,
    FinancialPlanRequest, FinancialPlanResponse
)
from services.portfolio_service import PortfolioService
from services.plan_service import PlanService
from services.ml_service import MLService
from auth import hash_password, verify_password

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
    
    # Hash the password
    password_hash = hash_password(user.password)
    
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=password_hash,
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


@app.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, update: UserUpdate, db: DB = Depends(get_db)):
    """Update user profile (email and password are not changed here)"""
    existing = db.get_user(user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    updated = User(
        name=update.name,
        age=update.age,
        email=existing.email,
        password_hash=existing.password_hash,
        current_income=update.current_income,
        current_savings=update.current_savings,
        monthly_savings=update.monthly_savings,
        risk_profile=update.risk_profile,
        created_at=existing.created_at,
    )
    result = db.update_user(user_id, updated)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to update user")
    return result


@app.get("/api/users/email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: DB = Depends(get_db)):
    """Get user profile by email"""
    user = db.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/auth/login", response_model=UserResponse)
def login(credentials: LoginRequest, db: DB = Depends(get_db)):
    """Authenticate user with email and password"""
    user = db.get_user_by_email(credentials.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user has a password hash (for backward compatibility with existing users)
    if not user.password_hash:
        raise HTTPException(
            status_code=401, 
            detail="This account was created before password authentication. Please create a new account or contact support."
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
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


@app.post("/api/portfolio/feasibility", response_model=FeasibilityResponse)
def compute_feasibility(request: FeasibilityRequest, db: DB = Depends(get_db)):
    """Recompute goal feasibility and projection for a given allocation without changing the stored portfolio"""
    user = db.get_user(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    alloc = request.allocation
    expected_return = (
        alloc.get("stocks", 0) * 0.08 +
        alloc.get("bonds",  0) * 0.04 +
        alloc.get("cash",   0) * 0.02
    ) / 100

    portfolio_service = PortfolioService()
    return {
        "expected_return": round(expected_return, 4),
        "goal_feasibility": portfolio_service._compute_goal_feasibility(user, request.goals, expected_return),
        "projection":       portfolio_service._compute_projection(user, request.goals, expected_return),
    }


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
