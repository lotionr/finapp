"""
File-based storage system using JSON files
Replaces database for MVP/mocking purposes
"""
import json
import os
from typing import List, Dict, Optional
from datetime import datetime
from pathlib import Path

# Data directory
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "users.json"
PORTFOLIOS_FILE = DATA_DIR / "portfolios.json"
GOALS_FILE = DATA_DIR / "goals.json"


class FileStorage:
    """Simple file-based storage manager"""
    
    @staticmethod
    def _read_json(file_path: Path, default: list = None) -> list:
        """Read JSON file, return default if file doesn't exist"""
        if default is None:
            default = []
        if not file_path.exists():
            return default
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return default
    
    @staticmethod
    def _write_json(file_path: Path, data: list):
        """Write data to JSON file"""
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    @staticmethod
    def get_next_id(items: List[Dict]) -> int:
        """Get next available ID"""
        if not items:
            return 1
        return max(item.get('id', 0) for item in items) + 1


class UserStorage:
    """User data storage"""
    
    @staticmethod
    def get_all() -> List[Dict]:
        return FileStorage._read_json(USERS_FILE)
    
    @staticmethod
    def get_by_id(user_id: int) -> Optional[Dict]:
        users = UserStorage.get_all()
        return next((u for u in users if u.get('id') == user_id), None)
    
    @staticmethod
    def get_by_email(email: str) -> Optional[Dict]:
        users = UserStorage.get_all()
        return next((u for u in users if u.get('email') == email), None)
    
    @staticmethod
    def create(user_data: Dict) -> Dict:
        users = UserStorage.get_all()
        user_data['id'] = FileStorage.get_next_id(users)
        user_data['created_at'] = datetime.now().isoformat()
        user_data['updated_at'] = None
        users.append(user_data)
        FileStorage._write_json(USERS_FILE, users)
        return user_data
    
    @staticmethod
    def update(user_id: int, user_data: Dict) -> Optional[Dict]:
        users = UserStorage.get_all()
        for i, user in enumerate(users):
            if user.get('id') == user_id:
                user_data['id'] = user_id
                user_data['created_at'] = user.get('created_at')
                user_data['updated_at'] = datetime.now().isoformat()
                users[i] = user_data
                FileStorage._write_json(USERS_FILE, users)
                return user_data
        return None


class PortfolioStorage:
    """Portfolio data storage"""
    
    @staticmethod
    def get_all() -> List[Dict]:
        return FileStorage._read_json(PORTFOLIOS_FILE)
    
    @staticmethod
    def get_by_user_id(user_id: int) -> Optional[Dict]:
        portfolios = PortfolioStorage.get_all()
        return next((p for p in portfolios if p.get('user_id') == user_id), None)
    
    @staticmethod
    def get_by_id(portfolio_id: int) -> Optional[Dict]:
        portfolios = PortfolioStorage.get_all()
        return next((p for p in portfolios if p.get('id') == portfolio_id), None)
    
    @staticmethod
    def create(portfolio_data: Dict) -> Dict:
        portfolios = PortfolioStorage.get_all()
        portfolio_data['id'] = FileStorage.get_next_id(portfolios)
        portfolio_data['created_at'] = datetime.now().isoformat()
        portfolio_data['updated_at'] = None
        portfolios.append(portfolio_data)
        FileStorage._write_json(PORTFOLIOS_FILE, portfolios)
        return portfolio_data
    
    @staticmethod
    def update(user_id: int, portfolio_data: Dict) -> Dict:
        portfolios = PortfolioStorage.get_all()
        # Check if portfolio exists for this user
        existing = PortfolioStorage.get_by_user_id(user_id)
        
        if existing:
            # Update existing
            for i, portfolio in enumerate(portfolios):
                if portfolio.get('user_id') == user_id:
                    portfolio_data['id'] = portfolio.get('id')
                    portfolio_data['user_id'] = user_id
                    portfolio_data['created_at'] = portfolio.get('created_at')
                    portfolio_data['updated_at'] = datetime.now().isoformat()
                    portfolios[i] = portfolio_data
                    FileStorage._write_json(PORTFOLIOS_FILE, portfolios)
                    return portfolio_data
        else:
            # Create new
            portfolio_data['user_id'] = user_id
            return PortfolioStorage.create(portfolio_data)


class GoalStorage:
    """Financial goal data storage"""
    
    @staticmethod
    def get_all() -> List[Dict]:
        return FileStorage._read_json(GOALS_FILE)
    
    @staticmethod
    def get_by_user_id(user_id: int) -> List[Dict]:
        goals = GoalStorage.get_all()
        return [g for g in goals if g.get('user_id') == user_id]
    
    @staticmethod
    def create(goal_data: Dict) -> Dict:
        goals = GoalStorage.get_all()
        goal_data['id'] = FileStorage.get_next_id(goals)
        goal_data['created_at'] = datetime.now().isoformat()
        goals.append(goal_data)
        FileStorage._write_json(GOALS_FILE, goals)
        return goal_data

