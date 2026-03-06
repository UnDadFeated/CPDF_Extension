$exe = "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
Stop-Process -Name Antigravity -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Start-Process $exe -ArgumentList '--remote-debugging-port=9000'