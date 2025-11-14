"""
Portfolio Service - Handles asset allocation logic
In production, this would integrate with ML models (GNN, FinBERT)
For MVP, we use rule-based allocation based on risk profile and goals
"""
from typing import Dict
from models import User
from schemas import FinancialGoalCreate


class PortfolioService:
    """Service for portfolio allocation and analysis"""
    
    def __init__(self):
        self.ml_service = None  # Would initialize ML service here in production
    
    def generate_allocation(
        self,
        user: User,
        goals: list[FinancialGoalCreate],
        time_horizon: int
    ) -> Dict:
        """
        Generate asset allocation based on user profile and goals
        
        For MVP, uses rule-based allocation:
        - Conservative: 40% stocks, 50% bonds, 10% cash
        - Moderate: 60% stocks, 30% bonds, 10% cash
        - Aggressive: 80% stocks, 15% bonds, 5% cash
        
        Adjusts based on time horizon (longer = more stocks)
        """
        base_allocations = {
            "conservative": {"stocks": 40, "bonds": 50, "cash": 10},
            "moderate": {"stocks": 60, "bonds": 30, "cash": 10},
            "aggressive": {"stocks": 80, "bonds": 15, "cash": 5}
        }
        
        risk_profile = user.risk_profile.lower()
        base_allocation = base_allocations.get(risk_profile, base_allocations["moderate"])
        
        # Adjust for time horizon (longer horizon = more stocks)
        if time_horizon > 10:
            # Increase stocks by up to 10%
            adjustment = min(10, time_horizon - 10)
            base_allocation["stocks"] = min(90, base_allocation["stocks"] + adjustment)
            base_allocation["bonds"] = max(5, base_allocation["bonds"] - adjustment)
        elif time_horizon < 5:
            # Decrease stocks for short-term goals
            adjustment = min(10, 5 - time_horizon)
            base_allocation["stocks"] = max(20, base_allocation["stocks"] - adjustment)
            base_allocation["bonds"] = min(60, base_allocation["bonds"] + adjustment)
        
        # Normalize to ensure total is 100%
        total = sum(base_allocation.values())
        if total != 100:
            for key in base_allocation:
                base_allocation[key] = round(base_allocation[key] / total * 100, 2)
        
        # Calculate expected return (simplified)
        expected_return = (
            base_allocation["stocks"] * 0.08 +  # 8% expected return for stocks
            base_allocation["bonds"] * 0.04 +   # 4% expected return for bonds
            base_allocation["cash"] * 0.02      # 2% expected return for cash
        ) / 100
        
        # Calculate risk score (0-1 scale)
        risk_score = base_allocation["stocks"] / 100
        
        reasoning = (
            f"Based on your {risk_profile} risk profile and {time_horizon}-year time horizon, "
            f"we recommend a portfolio allocation of {base_allocation['stocks']}% stocks, "
            f"{base_allocation['bonds']}% bonds, and {base_allocation['cash']}% cash. "
            f"This allocation balances growth potential with risk management."
        )
        
        return {
            "allocation": base_allocation,
            "reasoning": reasoning,
            "risk_score": round(risk_score, 2),
            "expected_return": round(expected_return, 4)
        }

