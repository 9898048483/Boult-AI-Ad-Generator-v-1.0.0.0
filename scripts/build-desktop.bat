@echo off
REM ==============================================================================
REM BOULT AI Ad Generator Suite - Windows (.exe / .msi) Build Script
REM ==============================================================================
echo =========================================================
echo BOULT AI Ad Generator Suite - Windows Desktop Build
echo =========================================================

echo [1/3] Installing NPM dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error during npm install!
    exit /b %ERRORLEVEL%
)

echo [2/3] Compiling Vite Frontend Production Bundle...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error during web build!
    exit /b %ERRORLEVEL%
)

echo [3/3] Checking Rust Cargo & Running Tauri Windows Build...
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Rust Cargo is not installed. Please install Rust from https://rustup.rs/ for native .exe creation.
    echo Web bundle compiled successfully in /dist.
    exit /b 0
)

call npx tauri build
echo =========================================================
echo SUCCESS! Windows Desktop Application built in src-tauri\target\release\bundle\
echo =========================================================
