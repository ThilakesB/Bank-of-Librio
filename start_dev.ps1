# start_dev.ps1 — Launch Backend + Frontend together
# Run from the repo root: .\start_dev.ps1

$root = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bank of Librio — RAG Dev Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── 1. Start FastAPI backend ──────────────────────────────────────────────────
Write-Host "`n[1/2] Starting FastAPI backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
  cd '$root\backend'
  Write-Host 'Backend: activating venv if available...' -ForegroundColor Cyan
  if (Test-Path '..\venv\Scripts\Activate.ps1') { & '..\venv\Scripts\Activate.ps1' }
  elseif (Test-Path '..\env\Scripts\Activate.ps1') { & '..\env\Scripts\Activate.ps1' }
  python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
"@

# ── 2. Start Vite frontend ────────────────────────────────────────────────────
Write-Host "[2/2] Starting Vite frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
  cd '$root\frontend'
  npm run dev
"@

Write-Host "`n✅ Both servers launching in separate windows." -ForegroundColor Green
Write-Host "   Backend: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "`nOpen http://localhost:5173 in your browser once both are ready.`n" -ForegroundColor Cyan
