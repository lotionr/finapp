"""
Initialize database - creates tables if they don't exist
Run this script once to set up the database schema
"""
from database import engine, Base
from models import User, Portfolio, FinancialGoal

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()

