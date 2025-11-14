from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int
    current_income: float
    current_savings: float
    risk_profile: str  # conservative, moderate, aggressive


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: int
    current_income: float
    current_savings: float
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
    time_horizon: int  # years


class AssetAllocationResponse(BaseModel):
    allocation: Dict[str, float]
    reasoning: str
    risk_score: float
    expected_return: float


# Financial Plan Schemas
class FinancialPlanRequest(BaseModel):
    user_id: int
    goals: List[FinancialGoalCreate]


class FinancialPlanResponse(BaseModel):
    summary: str

