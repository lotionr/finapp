# Quick Start Guide

## Prerequisites
- Python 3.11+ 
- Node.js 18+ and npm
- (Optional) OpenAI API key for AI-generated financial plans

## Starting the Application

### Option 1: Using Startup Scripts

**Terminal 1 - Backend:**
```bash
./start_backend.sh
```
Backend will run on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
./start_frontend.sh
```
Frontend will run on http://localhost:3000

### Option 2: Manual Start

**Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

**Frontend:**
```bash
cd frontend
npm start
```

## Testing the Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Should return: `{"status":"healthy"}`

2. **Test API Endpoint:**
   ```bash
   curl http://localhost:8000/api/users/1
   ```
   Should return user data for John Doe

3. **Frontend:**
   - Open http://localhost:3000 in your browser
   - You should see the Financial Planning Application

## Sample Data

The application comes with 3 pre-loaded users:
- User ID 1: John Doe (moderate risk)
- User ID 2: Jane Smith (aggressive risk)
- User ID 3: Robert Johnson (conservative risk)

You can test the API with these user IDs or create new users through the frontend.

## Troubleshooting

**Backend won't start:**
- Make sure virtual environment is activated
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify data files exist in `backend/data/`

**Frontend won't start:**
- Make sure dependencies are installed: `npm install`
- Check that backend is running on port 8000
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**API connection errors:**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `REACT_APP_API_URL` in frontend (defaults to http://localhost:8000)
