$projectRoot = "C:\Users\João Carvalho\Documents\jcprevdados"
$nodePath = "C:\Program Files\nodejs"

function Start-PowerShellWindow {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Script
  )

  $bytes = [System.Text.Encoding]::Unicode.GetBytes($Script)
  $encoded = [Convert]::ToBase64String($bytes)
  Start-Process powershell -ArgumentList "-NoExit", "-EncodedCommand", $encoded | Out-Null
}

Set-Location -LiteralPath $projectRoot

Start-PowerShellWindow @"
Set-Location -LiteralPath '$projectRoot'
docker compose up -d
"@

Start-Sleep -Seconds 3

Start-PowerShellWindow @"
`$env:Path = '$nodePath;' + `$env:Path
Set-Location -LiteralPath '$projectRoot\apps\api'
& '$nodePath\npm.cmd' run start:dev
"@

Start-PowerShellWindow @"
`$env:Path = '$nodePath;' + `$env:Path
Set-Location -LiteralPath '$projectRoot\apps\web'
& '$nodePath\npm.cmd' run dev
"@
