<#
.SYNOPSIS
  Clear a Parvis estop: remove the stop sentinel and set STATE back to RUN.

.DESCRIPTION
  The PowerShell equivalent of `parvis clear`, for Windows machines without Node.

  A Parvis tree is stopped by either of two facts (protocol/01-ESTOP.md):
    - the SENTINEL: a regular FILE named exactly `estop`, at the tree root or in any parent
      directory. It outranks everything. A directory named estop, or a file named ESTOP.md,
      is NOT a sentinel and is never touched here.
    - the STATE MIRROR: line one of <root>\_os\estop\STATE, one of RUN, YELLOW or STOP.

  This script removes every sentinel that would stop the tree (the root's and, unless
  -RootOnly is given, each parent's), then writes the one line `RUN` to the STATE mirror, then
  re-reads both and says whether the tree is really clear.

  ONLY THE OPERATOR CLEARS A STOP (01 section 4). Run this yourself, at a terminal. Do not
  wire it into an agent, a hook, a scheduled task or a CI job: an auto-clearing handler
  inverts the fail-safe.

  Parent sentinels may belong to ANOTHER tree ("multiple roots trip independently", 01
  section 1). Every file removed is printed, and -WhatIf shows the list without touching
  anything. Use -RootOnly to leave anything above the root alone.

.PARAMETER Root
  The tree to clear. Defaults to $env:PARVIS_ROOT, else the current directory.

.PARAMETER RootOnly
  Remove only the sentinel at -Root itself, not the ones in its parent directories.

.EXAMPLE
  .\clear-estop.ps1 -Root C:\path\to\your\tree -WhatIf
  Lists what would be removed and changes nothing.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\clear-estop.ps1 -Root C:\path\to\your\tree
  Clears the stop for that tree.

  Windows PowerShell 5.1 and PowerShell 7. ASCII only.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Root = $(if ($env:PARVIS_ROOT) { $env:PARVIS_ROOT } else { (Get-Location).Path }),
    [switch]$RootOnly
)

$ErrorActionPreference = 'Stop'

try {
    $rootFull = (Resolve-Path -LiteralPath $Root).ProviderPath
} catch {
    Write-Host "no such directory: $Root"
    exit 1
}
if (-not (Test-Path -LiteralPath $rootFull -PathType Container)) {
    Write-Host "not a directory: $rootFull"
    exit 1
}

# Every sentinel that stops a tree at $start: its own, then each parent's (01 section 1).
# Test for a FILE. A matcher that accepted a directory or ESTOP.md would create a stop
# that can never be cleared.
function Find-Sentinels {
    param([string]$Start, [bool]$OnlyHere)
    $found = @()
    $dir = $Start
    while ($dir) {
        $candidate = Join-Path $dir 'estop'
        if (Test-Path -LiteralPath $candidate -PathType Leaf) { $found += $candidate }
        if ($OnlyHere) { break }
        $parent = Split-Path -Path $dir -Parent
        if (-not $parent -or $parent -eq $dir) { break }
        $dir = $parent
    }
    return ,$found
}

Write-Host ""
Write-Host "root     $rootFull"

$sentinels = Find-Sentinels -Start $rootFull -OnlyHere ([bool]$RootOnly)
if ($sentinels.Count -eq 0) {
    Write-Host "sentinel none found"
} else {
    foreach ($s in $sentinels) {
        if ($PSCmdlet.ShouldProcess($s, 'Remove the stop sentinel')) {
            Remove-Item -LiteralPath $s -Force
            Write-Host "removed  $s"
        }
    }
}

# The STATE mirror is one line, nothing else (01 section 1).
$stateDir = Join-Path (Join-Path $rootFull '_os') 'estop'
$state    = Join-Path $stateDir 'STATE'
if ($PSCmdlet.ShouldProcess($state, 'Set the STATE mirror to RUN')) {
    New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
    [System.IO.File]::WriteAllText($state, "RUN`n")
    Write-Host "state    $state -> RUN"
}

if ($WhatIfPreference) {
    Write-Host ""
    Write-Host "(-WhatIf: nothing was changed)"
    exit 0
}

# Say what is true now, not what was intended.
$still = Find-Sentinels -Start $rootFull -OnlyHere $false
$line  = ''
try { $line = (Get-Content -LiteralPath $state -TotalCount 1).Trim() } catch { $line = '' }

Write-Host ""
if ($still.Count -gt 0) {
    foreach ($s in $still) { Write-Host "STILL STOPPED by the sentinel at $s" }
    if ($RootOnly) { Write-Host "It is above -Root. Run again without -RootOnly if it is yours to clear." }
    exit 1
}
if ($line -ne 'RUN') {
    Write-Host "STILL NOT RUN: the STATE mirror reads '$line'"
    exit 1
}
Write-Host "CLEAR. No sentinel at this root or above it, and STATE reads RUN."
Write-Host "No file restarts a session that already stopped; start it again yourself."
exit 0
