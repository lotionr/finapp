"""
Initialize mock data files
This script creates the data directory and populates it with sample data
"""
import json
from pathlib import Path
from datetime import datetime

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# Sample users
users = [
    {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "age": 35,
        "current_income": 85000.0,
        "current_savings": 45000.0,
        "risk_profile": "moderate",
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "age": 28,
        "current_income": 65000.0,
        "current_savings": 25000.0,
        "risk_profile": "aggressive",
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    },
    {
        "id": 3,
        "name": "Robert Johnson",
        "email": "robert.j@example.com",
        "age": 52,
        "current_income": 120000.0,
        "current_savings": 180000.0,
        "risk_profile": "conservative",
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    }
]

# Sample portfolios
portfolios = [
    {
        "id": 1,
        "user_id": 1,
        "allocation": {
            "stocks": 60,
            "bonds": 30,
            "cash": 10
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    },
    {
        "id": 2,
        "user_id": 2,
        "allocation": {
            "stocks": 75,
            "bonds": 20,
            "cash": 5
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    },
    {
        "id": 3,
        "user_id": 3,
        "allocation": {
            "stocks": 40,
            "bonds": 50,
            "cash": 10
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": None
    }
]

# Sample goals
goals = [
    {
        "id": 1,
        "user_id": 1,
        "goal_name": "Retirement Fund",
        "target_amount": 500000.0,
        "target_date": "2040-12-31",
        "priority": "high",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 2,
        "user_id": 1,
        "goal_name": "House Down Payment",
        "target_amount": 80000.0,
        "target_date": "2026-06-30",
        "priority": "high",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 3,
        "user_id": 2,
        "goal_name": "Early Retirement",
        "target_amount": 1000000.0,
        "target_date": "2035-12-31",
        "priority": "high",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 4,
        "user_id": 3,
        "goal_name": "Retirement Security",
        "target_amount": 750000.0,
        "target_date": "2030-12-31",
        "priority": "high",
        "created_at": datetime.now().isoformat()
    }
]

def init_data():
    """Initialize data files with sample data"""
    print("Initializing mock data files...")
    
    # Write users
    with open(DATA_DIR / "users.json", 'w') as f:
        json.dump(users, f, indent=2, default=str)
    print(f"✓ Created {len(users)} sample users")
    
    # Write portfolios
    with open(DATA_DIR / "portfolios.json", 'w') as f:
        json.dump(portfolios, f, indent=2, default=str)
    print(f"✓ Created {len(portfolios)} sample portfolios")
    
    # Write goals
    with open(DATA_DIR / "goals.json", 'w') as f:
        json.dump(goals, f, indent=2, default=str)
    print(f"✓ Created {len(goals)} sample financial goals")
    
    print("\nMock data initialization complete!")
    print(f"Data files are stored in: {DATA_DIR}")

if __name__ == "__main__":
    init_data()

