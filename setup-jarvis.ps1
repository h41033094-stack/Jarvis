# J.A.R.V.I.S. Core - Windows Deployment Protocol
# Description: This script automates the installation of the Node.js runtime and synchronizes J.A.R.V.I.S. with the local Windows environment.
# Execution: Right-click and "Run with PowerShell" as Administrator.

$ErrorActionPreference = "Stop"

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "J.A.R.V.I.S. CORE DEPLOYMENT PROTOCOL [DESKTOP_OS_INSTALLER]" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

# 1. Verify Administrative Privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Sir, I require Administrative elevation to modify system runtime and configure boot launch. Please re-run this protocol as Administrator."
    exit
}

# 2. Synchronize Node.js Runtime
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Sir, Node.js is not detected on this terminal. Initiating automatic retrieval..." -ForegroundColor Yellow
    
    # Install winget if missing (standard on modern Win10/11)
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Error "Winget is missing. Please install the App Installer from the Microsoft Store to proceed, Sir."
        exit
    }

    Write-Host "Installing Node.js LTS via Winget..." -ForegroundColor Cyan
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    
    # Reload environment variables for current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js installation failed or terminal requires a restart, Sir."
        exit
    }
}

Write-Host "Node.js Runtime: $(node -v) [SYNCHRONIZED]" -ForegroundColor Green

# 3. Synchronize Dependencies
Write-Host "Synchronizing dependency matrix for desktop integration..." -ForegroundColor Cyan
npm install

# 4. Configure Boot Launch (Optional Shortcut)
$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Jarvis.lnk"
if (-not (Test-Path $ShortcutPath)) {
    Write-Host "Configuring autonomous initialization on system boot..." -ForegroundColor Cyan
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = "$(Get-Command npm).Path"
    $Shortcut.Arguments = "run electron:dev"
    $Shortcut.WorkingDirectory = Get-Location
    $Shortcut.IconLocation = "shell32.dll, 45"
    $Shortcut.Save()
}

# 5. Initiate J.A.R.V.I.S. Core
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "DESKTOP SHELL INITIATED. STANDING BY FOR SYSTEM-WIDE UPLINK..." -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

# Launch the desktop app
npm run electron:dev
