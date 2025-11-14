# How to Restart the Application

## Quick Restart

### Option 1: Using Startup Scripts (Easiest)

**Terminal 1 - Backend:**
```bash
./start_backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start_frontend.sh
```

### Option 2: Manual Restart

**Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Frontend:**
```bash
cd frontend
npm start
```

## If Servers Are Already Running

### Stop Current Servers

1. **Backend**: Press `Ctrl+C` in the backend terminal
2. **Frontend**: Press `Ctrl+C` in the frontend terminal

### Then Restart

Follow the "Quick Restart" steps above.

## Force Kill (If Servers Won't Stop)

If `Ctrl+C` doesn't work:

**Kill Backend:**
```bash
pkill -f "python main.py"
# or
lsof -ti:8000 | xargs kill -9
```

**Kill Frontend:**
```bash
pkill -f "react-scripts"
# or
lsof -ti:3000 | xargs kill -9
```

## Verify Servers Are Running

**Check Backend:**
```bash
curl http://localhost:8000/api/health
```
Should return: `{"status":"healthy"}`

**Check Frontend:**
Open browser to: http://localhost:3000

## Troubleshooting

**Port Already in Use:**
- Backend (port 8000): Kill the process using the port (see Force Kill above)
- Frontend (port 3000): Same as above

**Changes Not Showing:**
- Backend: Restart the server
- Frontend: Usually auto-reloads, but if not, restart it
