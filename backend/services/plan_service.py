"""
Plan Service - Generates financial plan summaries using OpenAI
"""
import os
from openai import OpenAI
from typing import List
from models import User, Portfolio
from schemas import FinancialGoalCreate


class PlanService:
    """Service for generating financial plan summaries using OpenAI"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None
    
    async def generate_plan(
        self,
        user: User,
        portfolio: Portfolio,
        goals: List[FinancialGoalCreate]
    ) -> str:
        """
        Generate a comprehensive financial plan summary using OpenAI
        """
        # Prepare user context
        goals_text = "\n".join([
            f"- {goal.goal_name}: ${goal.target_amount:,.0f} by {goal.target_date} (Priority: {goal.priority})"
            for goal in goals
        ])
        
        allocation_text = ", ".join([
            f"{asset}: {percentage}%"
            for asset, percentage in portfolio.allocation.items()
        ])
        
        prompt = f"""You are a financial planning advisor. Create a comprehensive financial plan summary for the following client:

Client Profile:
- Name: {user.name}
- Age: {user.age}
- Current Income: ${user.current_income:,.0f} per year
- Current Savings: ${user.current_savings:,.0f}
- Risk Profile: {user.risk_profile}

Financial Goals:
{goals_text}

Recommended Portfolio Allocation:
{allocation_text}

Please provide a clear, actionable financial plan that:
1. Summarizes the client's financial situation
2. Addresses each financial goal with specific recommendations
3. Explains the rationale behind the asset allocation
4. Provides actionable next steps
5. Includes considerations for risk management

Keep the response professional, clear, and under 500 words."""

        # If OpenAI client is not available, return fallback plan
        if not self.client:
            # Fallback if OpenAI API key not configured
            return self._generate_fallback_plan(user, goals_text, allocation_text)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert financial advisor providing personalized financial planning advice."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            # Fallback if OpenAI API fails
            return self._generate_fallback_plan(user, goals_text, allocation_text)
    
    def _generate_fallback_plan(self, user: User, goals_text: str, allocation_text: str) -> str:
        """Generate a fallback plan when OpenAI is not available"""
        return f"""Financial Plan Summary for {user.name}

Based on your profile:
- Age: {user.age}
- Income: ${user.current_income:,.0f}/year
- Savings: ${user.current_savings:,.0f}
- Risk Tolerance: {user.risk_profile}

Your Financial Goals:
{goals_text}

Recommended Portfolio Allocation:
{allocation_text}

Next Steps:
1. Review and adjust your portfolio allocation based on your comfort level
2. Set up automatic contributions to align with your goals
3. Regularly review and rebalance your portfolio
4. Consider tax-advantaged accounts for long-term goals

Note: This is a preliminary plan. Consult with a certified financial planner for personalized advice.
"""

