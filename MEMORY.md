# MEMORY.md - Operational Dashboard

## 🧠 Active Context: `gba-portal` (Next.js 15)

- **Tech Stack**: Next.js 15 (App Router), Tailwind CSS (v4 setup), TypeScript.
- **Current State**: 
    - Landing: Showcases club values/sponsors. simplified navbar.
    - Dashboard: Accessible via `/login` (code: DEMO), mocks implemented.
    - Shop: `/shop` with pre-order flow.
    - Sponsors: `/sponsors` listing partners.
- **Git**: Repo root is workspace root. `gba-portal/` is a sub-folder but main focus.
- **Server**: Running on `localhost:3000` (PID managed by `process`).

## ⚠️ Critical Constraints

- **LOW TOKEN MODE**: Minimize output. Group tool calls. Avoid full-file reads if possible.
- **Autonomous**: Self-correct errors.
- **Security**: Do not leak private data.

## 📌 Pending / Next Actions

- Monitor `dev-server.log` for runtime errors.
- Refine Dashboard features (currently mocks).
- Optimize performance/SEO (Lighthouse audit pending).

## 🛠️ Tooling & Config

- **Models**: `google-gemini-cli/gemini-3-pro-preview` (Current), `openai-codex/gpt-5.3-codex` (Preferred/Fallback).
- **Fallbacks**: Gemini -> GPT-5.1-mini.
- **Project Map**: See `project-map.txt` for file structure.
