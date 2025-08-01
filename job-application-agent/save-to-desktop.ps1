# Decentralized Job Application Agent - Project Setup Script
# PowerShell Version

param(
    [string]$Destination = "",
    [switch]$Force,
    [switch]$Help
)

# Show help if requested
if ($Help) {
    Write-Host @"
Decentralized Job Application Agent - Setup Script

Usage: .\save-to-desktop.ps1 [options]

Options:
    -Destination <path>    Custom destination path (default: Desktop\Projects)
    -Force                 Overwrite existing project without confirmation
    -Help                  Show this help message

Examples:
    .\save-to-desktop.ps1
    .\save-to-desktop.ps1 -Destination "C:\MyProjects"
    .\save-to-desktop.ps1 -Force

"@
    exit 0
}

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to get desktop path
function Get-DesktopPath {
    try {
        $desktop = [Environment]::GetFolderPath("Desktop")
        return $desktop
    }
    catch {
        return "$env:USERPROFILE\Desktop"
    }
}

# Function to check Node.js installation
function Test-NodeJS {
    try {
        $nodeVersion = node --version 2>$null
        $npmVersion = npm --version 2>$null
        return @{
            NodeInstalled = $nodeVersion -ne $null
            NpmInstalled = $npmVersion -ne $null
            NodeVersion = $nodeVersion
            NpmVersion = $npmVersion
        }
    }
    catch {
        return @{
            NodeInstalled = $false
            NpmInstalled = $false
            NodeVersion = $null
            NpmVersion = $null
        }
    }
}

# Main execution
try {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Decentralized Job Application Agent" -ForegroundColor Cyan
    Write-Host "  Project Setup Script (PowerShell)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    # Check administrator privileges
    if (Test-Administrator) {
        Write-ColorOutput "✅ Running with administrator privileges" "Green"
    } else {
        Write-ColorOutput "⚠️  Not running as administrator (this is usually fine)" "Yellow"
    }
    Write-Host ""

    # Get paths
    $desktopPath = Get-DesktopPath
    $sourcePath = $PSScriptRoot
    
    if ($Destination -eq "") {
        $projectPath = Join-Path $desktopPath "Projects\decentralized-job-agent"
    } else {
        $projectPath = Join-Path $Destination "decentralized-job-agent"
    }

    Write-ColorOutput "🚀 Setting up project..." "Cyan"
    Write-ColorOutput "📁 Source: $sourcePath" "Yellow"
    Write-ColorOutput "📁 Destination: $projectPath" "Yellow"
    Write-Host ""

    # Create destination directory
    $projectsDir = Split-Path $projectPath -Parent
    if (!(Test-Path $projectsDir)) {
        New-Item -ItemType Directory -Path $projectsDir -Force | Out-Null
        Write-ColorOutput "✅ Created Projects directory" "Green"
    }

    # Check if project already exists
    if (Test-Path $projectPath) {
        if ($Force) {
            Write-ColorOutput "🗑️  Removing existing project (Force mode)..." "Yellow"
            Remove-Item -Path $projectPath -Recurse -Force
        } else {
            Write-ColorOutput "⚠️  Project directory already exists" "Yellow"
            $response = Read-Host "Do you want to overwrite it? (y/N)"
            if ($response -eq "y" -or $response -eq "Y") {
                Write-ColorOutput "🗑️  Removing existing project..." "Yellow"
                Remove-Item -Path $projectPath -Recurse -Force
            } else {
                Write-ColorOutput "❌ Setup cancelled" "Red"
                exit 1
            }
        }
    }

    # Copy project files
    Write-ColorOutput "📋 Copying project files..." "Cyan"
    Copy-Item -Path $sourcePath -Destination $projectPath -Recurse -Force

    if (Test-Path $projectPath) {
        Write-Host ""
        Write-ColorOutput "✅ Project successfully copied to:" "Green"
        Write-ColorOutput "   $projectPath" "Yellow"
        Write-Host ""

        # Check Node.js installation
        $nodeInfo = Test-NodeJS
        if ($nodeInfo.NodeInstalled) {
            Write-ColorOutput "✅ Node.js is installed" "Green"
            Write-ColorOutput "   Version: $($nodeInfo.NodeVersion)" "Yellow"
        } else {
            Write-ColorOutput "❌ Node.js is not installed" "Red"
            Write-ColorOutput "   Please install Node.js from: https://nodejs.org/" "Yellow"
        }

        if ($nodeInfo.NpmInstalled) {
            Write-ColorOutput "✅ npm is installed" "Green"
            Write-ColorOutput "   Version: $($nodeInfo.NpmVersion)" "Yellow"
        } else {
            Write-ColorOutput "❌ npm is not installed" "Red"
            Write-ColorOutput "   Please install npm or Node.js from: https://nodejs.org/" "Yellow"
        }

        Write-Host ""
        Write-ColorOutput "📋 Setup Instructions:" "Cyan"
        Write-Host ""
        Write-ColorOutput "1️⃣  Open PowerShell as Administrator" "White"
        Write-ColorOutput "2️⃣  Navigate to project:" "White"
        Write-ColorOutput "   cd `"$projectPath`"" "Yellow"
        Write-Host ""
        Write-ColorOutput "3️⃣  Install dependencies:" "White"
        Write-ColorOutput "   npm run install:all" "Yellow"
        Write-Host ""
        Write-ColorOutput "4️⃣  Start development server:" "White"
        Write-ColorOutput "   npm run dev" "Yellow"
        Write-Host ""
        Write-ColorOutput "5️⃣  Access the application:" "White"
        Write-ColorOutput "   Frontend: http://localhost:3000" "Yellow"
        Write-ColorOutput "   Backend:  http://localhost:3001" "Yellow"
        Write-Host ""
        Write-ColorOutput "🧪 Testing Commands:" "Cyan"
        Write-ColorOutput "   cd frontend" "Yellow"
        Write-ColorOutput "   npm test                    # Unit tests" "Yellow"
        Write-ColorOutput "   npm run test:coverage      # Coverage report" "Yellow"
        Write-Host ""
        Write-ColorOutput "📖 Documentation:" "Cyan"
        Write-ColorOutput "   README.md                  # Project overview" "Yellow"
        Write-ColorOutput "   SETUP_INSTRUCTIONS.md      # Detailed setup guide" "Yellow"
        Write-Host ""
        Write-ColorOutput "🔧 Environment Setup:" "Cyan"
        Write-ColorOutput "   Create .env file in project root with:" "Yellow"
        Write-ColorOutput "   NODE_ENV=development" "Yellow"
        Write-ColorOutput "   PORT=3001" "Yellow"
        Write-ColorOutput "   JWT_SECRET=your-secret-key" "Yellow"
        Write-ColorOutput "   ENCRYPTION_KEY=your-32-char-key" "Yellow"
        Write-Host ""
        Write-ColorOutput "🎯 Quick Start (copy-paste):" "Cyan"
        Write-ColorOutput "   cd `"$projectPath`" && npm run install:all && npm run dev" "Yellow"
        Write-Host ""

        # Create quick start script
        $quickStartScript = @"
# Quick Start Script for Decentralized Job Application Agent
Write-Host "🚀 Starting Decentralized Job Application Agent..." -ForegroundColor Cyan
Set-Location "`$PSScriptRoot"
npm run install:all
if (`$LASTEXITCODE -eq 0) {
    npm run dev
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
"@

        $quickStartPath = Join-Path $projectPath "quick-start.ps1"
        $quickStartScript | Out-File -FilePath $quickStartPath -Encoding UTF8
        Write-ColorOutput "✅ Created quick-start.ps1 for easy setup" "Green"
        Write-Host ""
        Write-ColorOutput "🎉 Setup complete! Ready to develop." "Green"
        Write-Host ""

        # Create environment file template
        $envTemplate = @"
# Environment Configuration for Decentralized Job Application Agent
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=sqlite:./data/app.db

# Security
JWT_SECRET=your-super-secret-jwt-key-32-chars-long
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Blockchain
ETHEREUM_NETWORK=testnet
ETHEREUM_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID

# IPFS
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Privacy
GDPR_ENABLED=true
PRIVACY_MODE=strict
"@

        $envPath = Join-Path $projectPath ".env.template"
        $envTemplate | Out-File -FilePath $envPath -Encoding UTF8
        Write-ColorOutput "✅ Created .env.template file" "Green"
        Write-Host ""

    } else {
        Write-ColorOutput "❌ Failed to copy project files" "Red"
        exit 1
    }

} catch {
    Write-ColorOutput "❌ Error during setup: $($_.Exception.Message)" "Red"
    Write-Host ""
    Write-ColorOutput "Possible solutions:" "Yellow"
    Write-ColorOutput "1. Run as Administrator" "Yellow"
    Write-ColorOutput "2. Check if antivirus is blocking the operation" "Yellow"
    Write-ColorOutput "3. Ensure you have write permissions" "Yellow"
    Write-ColorOutput "4. Check available disk space" "Yellow"
    Write-Host ""
    exit 1
}