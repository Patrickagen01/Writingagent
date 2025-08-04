@echo off
echo ========================================
echo   Decentralized Job Application Agent
echo   Project Copy Script
echo ========================================
echo.

echo 🚀 Copying project to desktop...
echo.

REM Create the destination directory
if not exist "C:\Users\patre\Desktop\Projects" (
    mkdir "C:\Users\patre\Desktop\Projects"
    echo ✅ Created Projects directory
)

REM Copy the project
xcopy /E /I /Y "%~dp0" "C:\Users\patre\Desktop\Projects\decentralized-job-agent"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Project successfully copied to:
    echo    C:\Users\patre\Desktop\Projects\decentralized-job-agent
    echo.
    echo 📋 Next steps:
    echo    1. Open Command Prompt
    echo    2. Navigate to: C:\Users\patre\Desktop\Projects\decentralized-job-agent
    echo    3. Run: npm run install:all
    echo    4. Run: npm run dev
    echo.
    echo 🧪 To run tests:
    echo    cd frontend
    echo    npm run test:sprite
    echo.
    echo 📖 Read SETUP_INSTRUCTIONS.md for detailed instructions
    echo.
    pause
) else (
    echo ❌ Error copying project
    echo Please check if the source directory exists
    pause
)