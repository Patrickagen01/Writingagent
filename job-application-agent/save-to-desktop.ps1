# Decentralized Job Application Agent - Project Copy Script
# PowerShell Version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Decentralized Job Application Agent" -ForegroundColor Cyan
Write-Host "  Project Copy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$sourcePath = $PSScriptRoot
$destinationPath = "C:\Users\patre\Desktop\Projects\decentralized-job-agent"

Write-Host "🚀 Copying project to desktop..." -ForegroundColor Green
Write-Host ""

try {
    # Create the destination directory if it doesn't exist
    if (!(Test-Path "C:\Users\patre\Desktop\Projects")) {
        New-Item -ItemType Directory -Path "C:\Users\patre\Desktop\Projects" -Force
        Write-Host "✅ Created Projects directory" -ForegroundColor Green
    }

    # Copy the project
    Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
    
    Write-Host "✅ Project successfully copied to:" -ForegroundColor Green
    Write-Host "   $destinationPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Open Command Prompt or PowerShell" -ForegroundColor White
    Write-Host "   2. Navigate to: $destinationPath" -ForegroundColor White
    Write-Host "   3. Run: npm run install:all" -ForegroundColor White
    Write-Host "   4. Run: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 To run TestSprite tests:" -ForegroundColor Cyan
    Write-Host "   cd frontend" -ForegroundColor White
    Write-Host "   npm run test:sprite" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Read SETUP_INSTRUCTIONS.md for detailed instructions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend: http://localhost:3001" -ForegroundColor White
    Write-Host "   Health Check: http://localhost:3001/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 Privacy Features:" -ForegroundColor Cyan
    Write-Host "   ✅ GDPR Compliance" -ForegroundColor Green
    Write-Host "   ✅ Local AI Processing" -ForegroundColor Green
    Write-Host "   ✅ Data Encryption" -ForegroundColor Green
    Write-Host "   ✅ Multi-language Support" -ForegroundColor Green
    Write-Host "   ✅ Blockchain Integration" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Error copying project: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check if the source directory exists and you have permission to copy files." -ForegroundColor Yellow
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")