"""
Simple model classes for file-based storage
These are plain Python classes, not SQLAlchemy models
"""
from typing import Dict, Optional
from datetime import datetime


class User:
    """User model"""
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.name = kwargs.get('name')
        self.email = kwargs.get('email')
        self.password_hash = kwargs.get('password_hash')
        self.age = kwargs.get('age')
        self.current_income = kwargs.get('current_income')
        self.current_savings = kwargs.get('current_savings')
        self.monthly_savings = kwargs.get('monthly_savings')
        self.risk_profile = kwargs.get('risk_profile')
        self.created_at = kwargs.get('created_at')
        self.updated_at = kwargs.get('updated_at')
    
    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'age': self.age,
            'current_income': self.current_income,
            'current_savings': self.current_savings,
            'monthly_savings': self.monthly_savings,
            'risk_profile': self.risk_profile,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'User':
        return cls(**data)


class Portfolio:
    """Portfolio model"""
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.user_id = kwargs.get('user_id')
        self.allocation = kwargs.get('allocation', {})
        self.created_at = kwargs.get('created_at')
        self.updated_at = kwargs.get('updated_at')
    
    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'allocation': self.allocation,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Portfolio':
        return cls(**data)


class FinancialGoal:
    """Financial goal model"""
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.user_id = kwargs.get('user_id')
        self.goal_name = kwargs.get('goal_name')
        self.target_amount = kwargs.get('target_amount')
        self.target_date = kwargs.get('target_date')
        self.priority = kwargs.get('priority')
        self.created_at = kwargs.get('created_at')
    
    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'goal_name': self.goal_name,
            'target_amount': self.target_amount,
            'target_date': self.target_date,
            'priority': self.priority,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'FinancialGoal':
        return cls(**data)
