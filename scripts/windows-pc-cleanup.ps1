# Run: Right-click PowerShell -> Run as administrator, then:
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   & "F:\projects\next\kalamlibrary\scripts\windows-pc-cleanup.ps1"
#
# Stops common background load on Dell Latitude E5430 (Dell bloat, optional remote/ search).

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n=== Stopping heavy background services ===" -ForegroundColor Cyan

$servicesToDisable = @(
    "SupportAssistAgent",
    "DellTechHub",
    "DellClientManagementService",
    "WSearch"   # Windows Search indexer — high CPU on older PCs; Start menu still works, slower file search
)

foreach ($name in $servicesToDisable) {
    $svc = Get-Service -Name $name -ErrorAction SilentlyContinue
    if (-not $svc) { continue }
    Stop-Service -Name $name -Force -ErrorAction SilentlyContinue
    Set-Service -Name $name -StartupType Disabled -ErrorAction SilentlyContinue
    Write-Host "  $name -> stopped, disabled"
}

# AnyDesk: disable only if you do not need unattended remote access
$anydesk = Get-Service -Name "AnyDesk" -ErrorAction SilentlyContinue
if ($anydesk) {
    Stop-Service -Name "AnyDesk" -Force -ErrorAction SilentlyContinue
    Set-Service -Name "AnyDesk" -StartupType Manual -ErrorAction SilentlyContinue
    Write-Host "  AnyDesk -> stopped, set to Manual (start only when you open AnyDesk)"
}

Write-Host "`n=== Startup (current user) ===" -ForegroundColor Cyan
$runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
foreach ($prop in @("Docker Desktop")) {
    if (Get-ItemProperty -Path $runKey -Name $prop -ErrorAction SilentlyContinue) {
        Remove-ItemProperty -Path $runKey -Name $prop -ErrorAction SilentlyContinue
        Write-Host "  Removed startup: $prop"
    }
}

Write-Host "`n=== Kill Dell / SupportAssist processes (if still running) ===" -ForegroundColor Cyan
Get-Process | Where-Object { $_.Name -match '^Dell\.|^SupportAssist' } | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped $($_.Name)"
}

Write-Host "`nDone. Restart the PC once for a clean boot." -ForegroundColor Green
Write-Host "Also: Settings -> Apps -> Startup -> turn off OneDrive, Edge, Chrome if you do not need them at login.`n"