@echo off
d:
cd D:\App\nginx-1.28.0
tasklist | findstr /i "nginx.exe" >nul
if %errorlevel% neq 0 (
    start "" nginx.exe
)
exit
