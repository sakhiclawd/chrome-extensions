# Project 004: Focus Mode & Site Blocker

## Problem Statement
Users are easily distracted by social media, news, and entertainment sites during work or study sessions. Existing solutions are often too complex or lacks a minimalist professional aesthetic.

## Target Audience
- Professionals requiring deep work sessions.
- Students preparing for exams.
- Anyone looking to reduce digital distractions.

## Core Features
1. **Custom Blocklist:** User-defined list of domains to block.
2. **Timer-based Focus Sessions:** Set a duration (e.g., 25 min Pomodoro) for blocking.
3. **Focus Dashboard:** Minimalist popup showing time remaining and focus stats.
4. **Manifest V3 Compliance:** Use `declarativeNetRequest` for efficient and privacy-preserving blocking.

## Technical Requirements
- **Permissions:** `declarativeNetRequest`, `storage`, `alarms`.
- **Background Script:** Manage timers and update blocking rules.
- **Popup UI:** Clean, distraction-free interface for starting/stopping sessions.

## Roadmap
- [ ] Phase 1: Basic site blocking (static rules).
- [ ] Phase 2: Timer integration and dynamic rule management.
- [ ] Phase 3: Focus statistics and history.
- [ ] Phase 4: UI/UX refinement and production build.
