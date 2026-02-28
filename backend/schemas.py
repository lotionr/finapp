from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int
    current_income: float
    current_savings: float
    monthly_savings: float
    risk_profile: str  # conservative, moderate, aggressive


class UserUpdate(BaseModel):
    name: str
    age: int
    current_income: float
    current_savings: float
    monthly_savings: Optional[float] = None
    risk_profile: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: int
    current_income: float
    current_savings: float
    monthly_savings: Optional[float] = None
    risk_profile: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Portfolio Schemas
class PortfolioCreate(BaseModel):
    user_id: int
    allocation: Dict[str, float]


class PortfolioUpdate(BaseModel):
    allocation: Dict[str, float]


class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    allocation: Dict[str, float]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Financial Goal Schemas
class FinancialGoalCreate(BaseModel):
    user_id: int
    goal_name: str
    target_amount: float
    target_date: str
    priority: str


class FinancialGoalResponse(BaseModel):
    id: int
    user_id: int
    goal_name: str
    target_amount: float
    target_date: str
    priority: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Asset Allocation Schemas
class AssetAllocationRequest(BaseModel):
    user_id: int
    goals: List[FinancialGoalCreate]
    time_horizon: Optional[int] = 10  # fallback if goal dates are missing


class GoalFeasibility(BaseModel):
    goal_name: str
    target_amount: float
    target_date: str
    years_to_goal: float
    projected_value: float
    shortfall: float
    on_track: bool
    required_monthly_savings: float
    assumed_monthly_contribution: float


class ProjectionPoint(BaseModel):
    year: int
    value: float


class GoalAllocationBreakdown(BaseModel):
    goal_name: str
    time_horizon_years: int
    allocation: Dict[str, float]
    weight_pct: float


class AssetAllocationResponse(BaseModel):
    allocation: Dict[str, float]
    reasoning: str
    risk_score: float
    expected_return: float
    goal_feasibility: List[GoalFeasibility] = []
    projection: List[ProjectionPoint] = []
    goal_allocation_breakdown: List[GoalAllocationBreakdown] = []


# Feasibility recalculation (for manual allocation updates)
class FeasibilityRequest(BaseModel):
    user_id: int
    allocation: Dict[str, float]
    goals: List[FinancialGoalCreate]


class FeasibilityResponse(BaseModel):
    expected_return: float
    goal_feasibility: List[GoalFeasibility] = []
    projection: List[ProjectionPoint] = []


# Financial Plan Schemas
class FinancialPlanRequest(BaseModel):
    user_id: int
    goals: List[FinancialGoalCreate]


class FinancialPlanResponse(BaseModel):
    summary: str

