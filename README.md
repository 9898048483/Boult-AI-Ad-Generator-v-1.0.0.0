# 🚀 BOULT AI Ad Generator Suite (`@9898048483/boult-ai-ad-generator`)

[![Build & Release Status](https://github.com/9898048483/boult-ai-ad-generator/actions/workflows/release-multi-os.yml/badge.svg)](https://github.com/9898048483/boult-ai-ad-generator/actions)
[![NPM Package Version](https://img.shields.io/npm/v/@9898048483/boult-ai-ad-generator?color=orange&logo=npm)](https://www.npmjs.com/package/@9898048483/boult-ai-ad-generator)
[![GitHub Packages](https://img.shields.io/badge/GitHub%20Packages-v1.0.0-blue?logo=github)](https://github.com/9898048483/boult-ai-ad-generator/pkgs/npm/boult-ai-ad-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Platforms Supported](https://img.shields.io/badge/Platforms-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20CLI-purple)](https://github.com/9898048483/boult-ai-ad-generator)
[![Docker Image](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](docker-compose.yml)

The **BOULT AI Ad Generator Suite** is an enterprise-grade, cross-platform AI commercial ad creation suite. Engineered with a full-stack high-performance architecture, it seamlessly generates, renders, and exports high-resolution product advertisement imagery across Web, Desktop (Windows, macOS, Linux), Mobile (Android), and Node.js CLI environments.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |   React 18 + Vite + Tailwind CSS UI   |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
         +---------------+---------------+                         +---------------+---------------+
         | OffscreenCanvas Web Worker    |                         |  Local IndexedDB Sync Engine  |
         | (Multi-Ratio Rendering Thread)|                         | (Offline History & Layer Sync)|
         +---------------+---------------+                         +---------------+---------------+
                         |                                                         |
       +-----------------+-----------------+                     +-----------------+-----------------+
       |                                   |                     |                                   |
       v                                   v                     v                                   v
+--------------+                   +--------------+       +--------------+                   +--------------+
| Replicate    |                   | Gemini AI    |       | Tauri Rust   |                   | Android      |
| Flux-Schnell |                   | Imagen 3     |       | Commands     |                   | Scoped       |
| API Proxy    |                   | API Proxy    |       | (Native Disk)|                   | Storage      |
+--------------+                   +--------------+       +--------------+                   +--------------+
```

---

## ✨ Feature Highlights

- ⚡ **Multi-Engine AI Synthesis**: Dual integration with **Replicate (`black-forest-labs/flux-schnell`)** and **Google Gemini (`imagen-3.0-generate-002`)** with automatic prompt engineering and intelligent fallback.
- 🧵 **OffscreenCanvas Background Worker**: Multi-ratio asset rendering (1:1 Square, 9:16 Story, 16:9 Landscape, 4:3 Banner) executed in an isolated Web Worker thread to ensure 60fps main UI smoothness.
- 📱 **Android 13+ Scoped Storage & Capacitor Bridge**: Native MediaStore integration writing high-resolution ad assets directly to the `Pictures/BOULT_Ads/` Android device gallery.
- 🦀 **Tauri v2 Native Desktop Rust Engine**: High-performance system diagnostic commands (`get_system_specs`) and direct asynchronous disk writes (`save_image_to_disk`) on Windows 11, macOS, and Linux (Ubuntu/Parrot OS).
- 💾 **Offline-First IndexedDB Data Engine**: Automatic local persistence and recovery of prompt histories, generated ad assets, and custom studio canvas layer configurations with full JSON backup & restore.
- 💻 **Cross-Platform Node.js CLI**: Full-featured command-line utility for batch rendering and pipeline automation (`boult-ai-ad`).

---

## 🚀 Quick Start & Installation

### 1. Web Application & Dev Server

```bash
# Clone the repository
git clone https://github.com/9898048483/boult-ai-ad-generator.git
cd boult-ai-ad-generator

# Install dependencies
npm install

# Start local dev server (Express + Vite on Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 2. Global NPM CLI Tool Usage

```bash
# Install globally via NPM / GitHub Packages
npm install -g @9898048483/boult-ai-ad-generator

# Execute batch ad generation command
boult-ai-ad generate \
  --prompt "BOULT active noise cancelling wireless headphones on dark velvet aesthetic" \
  --count 4 \
  --output ./output_ads
```

---

## 🛠️ Multi-OS Native Builds

### Desktop (Windows, macOS, Linux)

Ensure Rust toolchain and platform dependencies (e.g. `libwebkit2gtk-4.1-dev` on Linux) are installed:

```bash
# Build desktop package for current OS
npm run build:desktop

# Or execute shell script directly
./scripts/build-desktop.sh
```

Artifacts will be generated under `src-tauri/target/release/bundle/`.

### Android APK Build

Ensure Android Studio / SDK and JDK 17 are configured:

```bash
# Sync Capacitor & build Android debug/release APK
npm run build:android

# Or execute script
./scripts/build-android.sh
```

---

## 🐳 Docker Deployment

To self-host the application using Docker and Docker Compose:

```bash
# Build and run containerized application
docker-compose up -d --build
```

The container binds to `0.0.0.0:3000` with health checks pre-configured.

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` or set environment variables:

```env
# Server Port Configuration
PORT=3000

# AI Provider Credentials
REPLICATE_API_TOKEN=r8_your_replicate_api_token
GEMINI_API_KEY=AIzaSy_your_gemini_api_key
```

---

## 🛡️ License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
