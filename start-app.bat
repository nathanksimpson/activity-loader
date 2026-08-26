@echo off
setlocal
pushd "%~dp0" 2>nul
if errorlevel 1 (
  echo Could not open this folder. If it is on a network drive, try mapping it first.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  echo Install Node.js first, then run this file again.
  popd
  pause
  exit /b 1
)

echo Starting Activity Loader...
echo A free port will be chosen automatically if 8080 is busy.
echo The browser should open by itself. If it does not, use the address printed below.
echo.
node serve.js --open
popd
