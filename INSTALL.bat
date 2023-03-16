chcp 65001
cd "%~dp0"
set app="%cd%\app.exe"
set auto="%cd%\auto.exe"
netsh advfirewall firewall add rule name="Shutdown Service Rule" dir=in action=allow program=%app% enable=yes
netsh advfirewall firewall add rule name="Auto Hot Py" dir=in action=allow program=%auto% enable=yes
REG ADD "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /V "Auto Hot Py" /t REG_SZ /F /D %auto%
start /b auto.exe
nssm stop "ShutdownService"
nssm remove "ShutdownService" confirm
nssm install "ShutdownService" %app%
nssm start "ShutdownService"
for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a
echo & echo.& echo.& echo.Введите в строке браузера с любого устройства подключенного к сети:& echo.###########################& echo.#   %NetworkIP%   #& echo.###########################& echo.для отключение компьютера
set /p DUMMY=Для продолжения нажмите ENTER...
