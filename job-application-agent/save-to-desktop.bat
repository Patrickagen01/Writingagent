@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Decentralized Job Application Agent
echo   Project Setup Script
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ⚠️  Not running as administrator (this is usually fine)
)
echo.

REM Get current user's desktop path dynamically
for /f "tokens=2*" %%a in ('reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Desktop 2^>nul') do set "DESKTOP_PATH=%%b"
if "%DESKTOP_PATH%"=="" set "DESKTOP_PATH=%USERPROFILE%\Desktop"

echo 🚀 Setting up project on desktop...
echo 📁 Desktop path: %DESKTOP_PATH%
echo.

REM Create the destination directory structure
set "PROJECT_PATH=%DESKTOP_PATH%\Projects\decentralized-job-agent"

if not exist "%DESKTOP_PATH%\Projects" (
    mkdir "%DESKTOP_PATH%\Projects"
    echo ✅ Created Projects directory
)

if exist "%PROJECT_PATH%" (
    echo ⚠️  Project directory already exists
    set /p "OVERWRITE=Do you want to overwrite it? (y/N): "
    if /i "!OVERWRITE!"=="Y" (
        echo 🗑️  Removing existing project...
        rmdir /s /q "%PROJECT_PATH%"
    ) else (
        echo ❌ Setup cancelled
        pause
        exit /b 1
    )
)

echo 📋 Copying project files...
xcopy /E /I /Y /Q "%~dp0" "%PROJECT_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Project successfully copied to:
    echo    %PROJECT_PATH%
    echo.
    
    REM Check if Node.js is installed
    node --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Node.js is installed
        for /f "tokens=*" %%i in ('node --version') do echo    Version: %%i
    ) else (
        echo ❌ Node.js is not installed
        echo    Please install Node.js from: https://nodejs.org/
        echo.
    )
    
    REM Check if npm is installed
    npm --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ npm is installed
        for /f "tokens=*" %%i in ('npm --version') do echo    Version: %%i
    ) else (
        echo ❌ npm is not installed
        echo    Please install npm or Node.js from: https://nodejs.org/
        echo.
    )
    
    echo.
    echo 📋 Setup Instructions:
    echo.
    echo 1️⃣  Open Command Prompt as Administrator
    echo 2️⃣  Navigate to project:
    echo    cd "%PROJECT_PATH%"
    echo.
    echo 3️⃣  Install dependencies:
    echo    npm run install:all
    echo.
    echo 4️⃣  Start development server:
    echo    npm run dev
    echo.
    echo 5️⃣  Access the application:
    echo    Frontend: http://localhost:3000
    echo    Backend:  http://localhost:3001
    echo.
    echo 🧪 Testing Commands:
    echo    cd frontend
    echo    npm test                    # Unit tests
    echo    npm run test:coverage      # Coverage report
    echo.
    echo 📖 Documentation:
    echo    README.md                  # Project overview
    echo    SETUP_INSTRUCTIONS.md      # Detailed setup guide
    echo.
    echo 🔧 Environment Setup:
    echo    Create .env file in project root with:
    echo    NODE_ENV=development
    echo    PORT=3001
    echo    JWT_SECRET=your-secret-key
    echo    ENCRYPTION_KEY=your-32-char-key
    echo.
    echo 🎯 Quick Start (copy-paste):
    echo    cd "%PROJECT_PATH%" ^&^& npm run install:all ^&^& npm run dev
    echo.
    
    REM Create a quick start batch file
    echo @echo off > "%PROJECT_PATH%\quick-start.bat"
    echo cd /d "%%~dp0" >> "%PROJECT_PATH%\quick-start.bat"
    echo npm run install:all >> "%PROJECT_PATH%\quick-start.bat"
    echo npm run dev >> "%PROJECT_PATH%\quick-start.bat"
    echo pause >> "%PROJECT_PATH%\quick-start.bat"
    
    echo ✅ Created quick-start.bat for easy setup
    echo.
    echo 🎉 Setup complete! Ready to develop.
    echo.
    pause
) else (
    echo.
    echo ❌ Error copying project files
    echo.
    echo Possible solutions:
    echo 1. Run as Administrator
    echo 2. Check if antivirus is blocking the operation
    echo 3. Ensure you have write permissions to Desktop
    echo 4. Check available disk space
    echo.
    echo Error code: %ERRORLEVEL%
    echo.
    pause
    exit /b 1
)