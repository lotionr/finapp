# File-Based Data Storage

This application uses JSON file-based storage instead of a database for the MVP version.

## Data Files

All data is stored in `backend/data/` directory:

- `users.json` - User profiles
- `portfolios.json` - Portfolio allocations
- `goals.json` - Financial goals

## Mock Data

The application comes with pre-populated sample data:

### Users (3)
- John Doe (ID: 1) - Moderate risk profile
- Jane Smith (ID: 2) - Aggressive risk profile  
- Robert Johnson (ID: 3) - Conservative risk profile

### Portfolios (3)
- User 1: 60% stocks, 30% bonds, 10% cash
- User 2: 75% stocks, 20% bonds, 5% cash
- User 3: 40% stocks, 50% bonds, 10% cash

### Goals (4)
- User 1: Retirement Fund ($500K by 2040)
- User 1: House Down Payment ($80K by 2026)
- User 2: Early Retirement ($1M by 2035)
- User 3: Retirement Security ($750K by 2030)

## Usage

The storage system automatically:
- Creates the `data/` directory if it doesn't exist
- Reads from JSON files on each request
- Writes to JSON files on each update
- Generates unique IDs automatically

## Reinitializing Data

To reset to sample data:

```bash
python init_data.py
```

This will overwrite existing data files with fresh sample data.

## API Compatibility

The file-based storage maintains the same API interface as the original database design, so no frontend changes are required.

