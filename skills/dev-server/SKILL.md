# SKILL: Server Management & Deployment

## Context
Running Next.js in this environment requires careful memory management to avoid SIGKILL (OOM) and port conflicts.

## Usage
- **Start Prod:** Use `npm run start` (after build) instead of `dev`.
- **Port Check:** Always check port 3000 before starting.
- **Cleanup:** Remove root `package-lock.json` if it conflicts with `gba-portal/package-lock.json`.

## Procedure: Safe Start
1. Check/Kill existing process on port 3000:
   ```bash
   fuser -k 3000/tcp || true
   ```
2. Navigate to project:
   ```bash
   cd gba-portal
   ```
3. Build (if needed):
   ```bash
   npm run build
   ```
4. Start with explicit host:
   ```bash
   npm start -- -H 0.0.0.0
   ```

## Troubleshooting
- **SIGKILL:** Usually OOM. Reduce concurrency or ensure no other heavy node processes are running.
- **EADDRINUSE:** Port 3000 is blocked. Use `fuser -k 3000/tcp`.
- **Lockfile Warning:** Delete `package-lock.json` in the workspace root, keep the one in `gba-portal/`.
