@echo off
echo =========================================
echo    LevelUp - Full-Stack Application      
echo =========================================

echo Starting Backend Server on port 5000...
start cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend Vite Client on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo LevelUp servers launched!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Demo Credentials:
echo Email:    demo@levelup.com
echo Password: Password123!
echo.
pause
