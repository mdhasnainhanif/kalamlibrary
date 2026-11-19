# Health report + re-apply fixes if Dell/Windows turned services back on.
# Non-admin: report only. Admin: same fixes as windows-pc-cleanup.ps1.
#
#   & "F:\projects\next\kalamlibrary\scripts\windows-pc-healthcheck.ps1"
# Admin (recommended after Windows Update):
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   & "F:\projects\next\kalamlibrary\scripts\windows-pc-healthcheck.ps1" -Repair

param([switch]$Repair)

$ErrorActionPreference = "SilentlyContinue"
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)

$cpu = (Get-CimInstance Win32_Processor).LoadPercentage
$os = Get-CimInstance Win32_OperatingSystem
$freeGb = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
$usedPct = [math]::Round((1 - $os.FreePhysicalMemory / $os.TotalVisibleMemorySize) * 100, 1)

function Sum-MB($name) {
    [math]::Round((Get-Process $name -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 0)
}

$chromeMb = (Get-Process chrome -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum
$chromeMb = if ($chromeMb) { [math]::Round($chromeMb / 1MB, 0) } else { 0 }
$cursorMb = (Get-Process Cursor -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum
$cursorMb = if ($cursorMb) { [math]::Round($cursorMb / 1MB, 0) } else { 0 }
$dellMb = (Get-Process *Dell*, SupportAssist* -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum
$dellMb = if ($dellMb) { [math]::Round($dellMb / 1MB, 0) } else { 0 }

Write-Host "`n=== PC health report ===" -ForegroundColor Cyan
Write-Host "  CPU load:        $cpu%"
Write-Host "  RAM free:        $freeGb GB (used $usedPct%)"
Write-Host "  Chrome RAM:      $chromeMb MB"
Write-Host "  Cursor RAM:      $cursorMb MB  (processes: $((Get-Process Cursor -ErrorAction SilentlyContinue).Count))"
Write-Host "  Dell/Support:    $dellMb MB"

$watch = @("SupportAssistAgent", "DellTechHub", "DellClientManagementService", "WSearch", "AnyDesk")
Write-Host "`n=== Services (should be Disabled/Manual + Stopped for Dell/Search) ===" -ForegroundColor Cyan
foreach ($n in $watch) {
    $s = Get-Service -Name $n -ErrorAction SilentlyContinue
    if ($s) {
        $ok = ($n -eq "AnyDesk" -and $s.StartType -eq "Manual") -or ($n -ne "AnyDesk" -and $s.StartType -eq "Disabled")
        $flag = if ($ok -and $s.Status -eq "Stopped") { "[OK]" } else { "[!!]" }
        Write-Host "  $flag $n  Status=$($s.Status)  Start=$($s.StartType)"
    }
}

$dockerRun = Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Docker Desktop" -ErrorAction SilentlyContinue
Write-Host "`n=== Startup registry ===" -ForegroundColor Cyan
Write-Host "  Docker in Run:   $(if ($dockerRun) { 'YES (remove)' } else { 'no' })"

if ($Repair -and $isAdmin) {
    Write-Host "`n=== Repair (re-run cleanup) ===" -ForegroundColor Yellow
    & "$PSScriptRoot\windows-pc-cleanup.ps1"
} elseif ($Repair -and -not $isAdmin) {
    Write-Host "`nRepair skipped: run PowerShell as Administrator." -ForegroundColor Red
} else {
    Write-Host "`nTip: After Windows Update, run with -Repair as Admin." -ForegroundColor DarkGray
}
Write-Host ""