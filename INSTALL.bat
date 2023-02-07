chcp 65001
cd "%~dp0"
set app="%cd%\app.exe"
netsh advfirewall firewall add rule name="Shutdown Service Rule" dir=in action=allow program="%app%" enable=yes
nssm install "ShutdownService" "%app%"
nssm start "ShutdownService"
for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a
echo & echo.& echo.& echo.Введите в строке браузера с любого устройства подключенного к сети:& echo.###########################& echo.#   %NetworkIP%   #& echo.###########################& echo.для отключение компьютера
set /p DUMMY=Для продолжения нажмите ENTER...
