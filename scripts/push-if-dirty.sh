#!/usr/bin/env bash
set -euo pipefail

# Run from repo root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Only act if there are changes (tracked or untracked that are not ignored)
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

# Quality gates (Option A)
(
  cd gba-portal
  npm run lint
  npm run type-check
  npm run format
)

# Stage + commit
# Note: respects .gitignore; won't add node_modules/.next

git add -A

# If staging results in nothing (edge case), stop
if git diff --cached --quiet; then
  exit 0
fi

STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DATE="$(date -u +%Y-%m-%d)"

git commit -m "chore(sync): daily update ${DATE}" -m "Auto-sync ${STAMP}"

# Push to origin/master
# (If auth isn't configured, this will fail and exit non-zero)
git push origin master
