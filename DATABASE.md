# Database Schema - Source of Truth

## 👤 Users & Profiles
- **profiles**: Base user profiles.
- **staff_profiles**: Detailed staff info.
- **coach_invitations**: Coach onboarding invitations.
- **coach_access_requests**: Access requests for coaches.

## 🏀 Teams & Players
- **teams**: Club teams.
- **players**: Club players.
- **categories**: Age/level categories.
- **competitions**: List of competitions.
- **staff_team_memberships**: Link between staff and teams (Legacy compatibility).

## 📅 Planning & Match Day
- **matches**: Game encounters (opponent, date, formation).
- **match_lineups**: Detailed composition (starters, subs, jersey numbers).
- **planning_sessions**: Training sessions or events.
- **attendance**: Player attendance tracking.
- **approval_requests**: Validation system for sessions/requests.

## 💳 Administrative
- **licences**: Player licenses tracking.
- **licence_payments**: Associated payments.
- **relances**: Administrative reminder logs.

## 🛠️ System
- **access_admin_events**: Access logs.

---
*Last update: 2026-02-19 - Synchronized from code and SQL files.*
