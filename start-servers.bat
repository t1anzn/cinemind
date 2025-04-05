@echo off
echo Starting CineMind Servers (Development Mode)...

:: Kill any running Flask server process on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a

:: Kill any running node processes (if necessary)
taskkill /f /im node.exe > nul 2>&1

:: Activate the virtual environment and start the Flask backend server
start cmd /k "cd backend && call ..\venv\Scripts\activate && cd app && flask run"

:: Wait for the backend to initialize (optional delay)
:: timeout /t 3

:: Start the frontend server
start cmd /k "cd frontend && npm run dev"

echo Both servers should be starting now.
echo Backend: http://localhost:5000 (Flask)
echo Frontend: http://localhost:4321 (Astro)