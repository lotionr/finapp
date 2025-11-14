"""
File-based database interface
This replaces SQLAlchemy for the MVP with file-based storage
"""
from storage import UserStorage, PortfolioStorage, GoalStorage
from models import User, Portfolio, FinancialGoal
from typing import Optional


class DB:
    """Database interface that mimics SQLAlchemy session"""
    
    # User operations
    def get_user(self, user_id: int) -> Optional[User]:
        user_data = UserStorage.get_by_id(user_id)
        return User.from_dict(user_data) if user_data else None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        user_data = UserStorage.get_by_email(email)
        return User.from_dict(user_data) if user_data else None
    
    def create_user(self, user: User) -> User:
        user_data = UserStorage.create(user.to_dict())
        return User.from_dict(user_data)
    
    def update_user(self, user_id: int, user: User) -> Optional[User]:
        user_data = UserStorage.update(user_id, user.to_dict())
        return User.from_dict(user_data) if user_data else None
    
    # Portfolio operations
    def get_portfolio_by_user_id(self, user_id: int) -> Optional[Portfolio]:
        portfolio_data = PortfolioStorage.get_by_user_id(user_id)
        return Portfolio.from_dict(portfolio_data) if portfolio_data else None
    
    def get_portfolio(self, portfolio_id: int) -> Optional[Portfolio]:
        portfolio_data = PortfolioStorage.get_by_id(portfolio_id)
        return Portfolio.from_dict(portfolio_data) if portfolio_data else None
    
    def create_portfolio(self, portfolio: Portfolio) -> Portfolio:
        portfolio_data = PortfolioStorage.create(portfolio.to_dict())
        return Portfolio.from_dict(portfolio_data)
    
    def update_portfolio(self, user_id: int, portfolio: Portfolio) -> Portfolio:
        portfolio_data = PortfolioStorage.update(user_id, portfolio.to_dict())
        return Portfolio.from_dict(portfolio_data)
    
    # Goal operations
    def get_goals_by_user_id(self, user_id: int) -> list[FinancialGoal]:
        goals_data = GoalStorage.get_by_user_id(user_id)
        return [FinancialGoal.from_dict(g) for g in goals_data]
    
    def create_goal(self, goal: FinancialGoal) -> FinancialGoal:
        goal_data = GoalStorage.create(goal.to_dict())
        return FinancialGoal.from_dict(goal_data)


# Global DB instance
db = DB()


def get_db():
    """Dependency function that returns DB instance"""
    return db
