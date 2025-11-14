# Financial Planning Application

A web application that helps individuals and investors identify the right asset allocation for financial planning and portfolio management.

## Features

- User input collection (financial goals, income, savings, risk profile)
- Asset allocation model generation
- Portfolio visualization and adjustment
- AI-powered financial plan summarization using OpenAI
- Sentiment analysis using FinBERT (mocked for MVP)
- ETF performance analysis using Graph Neural Networks (mocked for MVP)

## Project Structure

```
├── backend/          # Python FastAPI backend
│   ├── data/         # JSON file-based storage (mock data)
│   └── services/     # Business logic services
├── frontend/         # React frontend
└── README.md
```

## Quick Start

**Fastest way to get started:**

1. **Start Backend** (Terminal 1):
   ```bash
   ./start_backend.sh
   ```
   Or manually:
   ```bash
   cd backend && source venv/bin/activate && python main.py
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   ./start_frontend.sh
   ```
   Or manually:
   ```bash
   cd frontend && npm start
   ```

3. **Open Browser**: http://localhost:3000

See [QUICK_START.md](QUICK_START.md) for detailed instructions and troubleshooting.

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Set up environment variables for OpenAI:
```bash
cp .env.example .env
# Edit .env with your OpenAI API key (optional - app works without it)
```

5. Initialize mock data (optional - sample data already included):
```bash
python init_data.py
```

6. Run the server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`

**Note**: This MVP uses file-based JSON storage instead of a database. All data is stored in `backend/data/` directory. No MySQL setup required!

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /api/users` - Create user profile
- `GET /api/users/{user_id}` - Get user profile
- `POST /api/portfolio/analyze` - Analyze portfolio and generate allocation
- `GET /api/portfolio/{user_id}` - Get user portfolio
- `PUT /api/portfolio/{user_id}` - Update portfolio allocation
- `POST /api/plan/generate` - Generate financial plan summary

## Technology Stack

- **Backend**: Python, FastAPI, JSON file storage
- **Frontend**: React, JavaScript, Axios
- **AI/ML**: OpenAI API (optional), FinBERT (mocked), PyG/GNN (mocked)
- **Storage**: File-based JSON (no database required for MVP)

## Mock Data

The application comes with pre-populated mock data:
- 3 sample users with different risk profiles
- 3 sample portfolios
- 4 sample financial goals

All data is stored in `backend/data/` as JSON files. You can modify these files directly or use the API to create/update data.

