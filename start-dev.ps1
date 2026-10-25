# LevelUp Local Development Launch Script
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   LevelUp - Full-Stack Application      " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if node_modules exist in backend
if (!(Test-Path -Path "$PSScriptRoot\backend\node_modules")) {
    Write-Host "[1/4] Installing backend dependencies..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "install" -WorkingDirectory "$PSScriptRoot\backend" -Wait -NoNewWindow
}

# Check if node_modules exist in frontend
if (!(Test-Path -Path "$PSScriptRoot\frontend\node_modules")) {
    Write-Host "[2/4] Installing frontend dependencies..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "install" -WorkingDirectory "$PSScriptRoot\frontend" -Wait -NoNewWindow
}

Write-Host "[3/4] Starting Backend server on port 5000..." -ForegroundColor Green
$backendJob = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

Start-Sleep -Seconds 2

Write-Host "[4/4] Starting Frontend client on port 5173..." -ForegroundColor Green
$frontendJob = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host ""
Write-Host "LevelUp is launching!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Yellow
Write-Host "Email:    demo@levelup.com" -ForegroundColor White
Write-Host "Password: Password123!" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C or close the windows to stop the servers." -ForegroundColor Gray
