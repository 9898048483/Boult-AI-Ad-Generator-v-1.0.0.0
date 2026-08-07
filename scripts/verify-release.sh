#!/usr/bin/env bash

# BOULT AI Ad Generator Suite - Release Verification & Tagging Script
# Architect & Lead DevOps Engineer Pre-Release Pipeline Tool

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}${CYAN}"
echo "=========================================================="
echo "  ⚡ BOULT AI AD GENERATOR SUITE - PRE-RELEASE VERIFIER   "
echo "=========================================================="
echo -e "${NC}"

# 1. Environment Checks
echo -e "${BOLD}${YELLOW}[1/4] Checking DevOps Environment Tools...${NC}"

# Node.js Version Check
if command -v node &> /dev/null; then
  NODE_VER=$(node -v)
  echo -e "  ${GREEN}✓ Node.js:${NC} $NODE_VER"
else
  echo -e "  ${RED}✗ Node.js is missing! Please install Node.js v20+${NC}"
  exit 1
fi

# Rust / Cargo Check
if command -v cargo &> /dev/null; then
  CARGO_VER=$(cargo --version)
  echo -e "  ${GREEN}✓ Rust/Cargo:${NC} $CARGO_VER"
else
  echo -e "  ${YELLOW}! Rust/Cargo not found in PATH (Required for Tauri desktop builds)${NC}"
fi

# Docker Check
if command -v docker &> /dev/null; then
  DOCKER_VER=$(docker --version)
  echo -e "  ${GREEN}✓ Docker:${NC} $DOCKER_VER"
else
  echo -e "  ${YELLOW}! Docker not found in PATH (Optional for container deployment)${NC}"
fi

# Gradle Check
if [ -f "./android/gradlew" ]; then
  echo -e "  ${GREEN}✓ Android Gradle Wrapper:${NC} Present in ./android/gradlew"
elif command -v gradle &> /dev/null; then
  echo -e "  ${GREEN}✓ Gradle:${NC} $(gradle -v | head -n 1)"
else
  echo -e "  ${YELLOW}! Gradle wrapper missing (Capacitor android setup will generate on sync)${NC}"
fi

echo ""

# 2. Code Integrity & Build Checks
echo -e "${BOLD}${YELLOW}[2/4] Verifying Code Integrity & Running Linter...${NC}"

echo -e "  -> Running TypeScript typecheck (npm run lint)..."
npm run lint

echo -e "  -> Executing production bundle build (npm run build)..."
npm run build

echo -e "  ${GREEN}✓ Web & Server Build Assets Compiled Successfully!${NC}\n"

# 3. CLI Local Functional Test
echo -e "${BOLD}${YELLOW}[3/4] Testing Local CLI Utility (bin/boult-cli.js)...${NC}"

chmod +x ./bin/boult-cli.js

echo -e "  -> Verifying CLI --help..."
node ./bin/boult-cli.js --help > /dev/null

echo -e "  -> Verifying CLI --version..."
CLI_VERSION=$(node ./bin/boult-cli.js --version)
echo -e "  ${GREEN}✓ CLI Executable Functional (v$CLI_VERSION)${NC}\n"

# 4. Release Version Tagging Helper
echo -e "${BOLD}${YELLOW}[4/4] Release Version Tagging Helper${NC}"

PACKAGE_VERSION=$(node -e "console.log(require('./package.json').version)")
TAG_NAME="v$PACKAGE_VERSION"

echo -e "  Current package.json version: ${BOLD}${CYAN}$PACKAGE_VERSION${NC}"
echo -e "  Target Git Release Tag:       ${BOLD}${CYAN}$TAG_NAME${NC}"

if [ -t 0 ]; then
  read -p "Do you want to stage changes, create tag '$TAG_NAME', and push to origin? (y/N) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "  -> Staging pending changes..."
    git add .
    git commit -m "chore(release): $TAG_NAME [skip ci]" || true
    echo -e "  -> Creating git tag $TAG_NAME..."
    git tag -a "$TAG_NAME" -m "BOULT AI Suite Release $TAG_NAME"
    echo -e "  -> Pushing commits & tags to origin..."
    git push origin main --tags || git push origin master --tags
    echo -e "  ${GREEN}✓ Tag $TAG_NAME pushed! GitHub Actions release matrix pipeline triggered.${NC}"
  else
    echo -e "  Skipped git release tagging step."
  fi
else
  echo -e "  Non-interactive shell detected. Run the following commands to tag and trigger GitHub release:"
  echo -e "    ${CYAN}git add .${NC}"
  echo -e "    ${CYAN}git commit -m 'chore(release): $TAG_NAME'${NC}"
  echo -e "    ${CYAN}git tag -a '$TAG_NAME' -m 'Release $TAG_NAME'${NC}"
  echo -e "    ${CYAN}git push origin main --tags${NC}"
fi

echo -e "\n${BOLD}${GREEN}=========================================================="
echo "  🎉 PRE-RELEASE VERIFICATION COMPLETE - ALL SYSTEMS READY!"
echo "==========================================================${NC}\n"
