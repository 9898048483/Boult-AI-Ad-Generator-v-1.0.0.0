#!/usr/bin/env bash
# ==============================================================================
# BOULT AI Ad Generator Suite - Linux & macOS Desktop Build Script
# ==============================================================================
set -e

echo "🚀 [BOULT AI Suite] Initializing Desktop Build Process for Linux / macOS..."

# 1. Verify Node Environment
echo "📦 Step 1: Checking Node.js dependencies..."
npm install

# 2. Build Web Frontend Assets
echo "⚡ Step 2: Compiling Web Production Bundle (Vite)..."
npm run build

# 3. Verify Rust & Tauri CLI
if ! command -v cargo &> /dev/null; then
    echo "⚠️ Rust / Cargo not found. Please install Rust from https://rustup.rs/ to compile Tauri native binaries."
    echo "Skipping native Tauri binary bundle, Web bundle is ready in /dist."
    exit 0
fi

# 4. Execute Tauri Build
echo "🦀 Step 3: Compiling Tauri Native Desktop Application (.AppImage, .deb, .dmg)..."
if [ -d "src-tauri" ]; then
    npx @tauri-apps/cli build || npx tauri build
    echo "✅ Desktop compilation complete! Installers generated in src-tauri/target/release/bundle/"
else
    echo "⚠️ src-tauri directory not found. Please ensure Tauri configuration is present."
fi
