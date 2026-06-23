#!/bin/sh
set -eu

# Cloud dev install script. Runs when an agent runs in the cloud.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

. "$NVM_DIR/nvm.sh"
corepack enable

cd "$ROOT"
nvm install
corepack prepare --activate
pnpm install --frozen-lockfile
