# Tab Manager (Chrome Extension)

Efficient tab management for power users.

## Problem Solved
Managing a high volume of open tabs causes browser performance issues and cognitive overload. This extension provides tools to organize, search, and manage memory usage.

## Core Features
- **Searching:** Filter open tabs by title or URL.
- **Grouping:** Group tabs by domain to see them in a structured list.
- **Suspending:** Manually suspend tabs to a placeholder page (`suspended.html`) to save browser resources.
- **Session Management:** Save all tabs in the current window to `chrome.storage` for later restoration.
- **Quick Controls:** Close or switch to tabs directly from the popup.

## Technical Details
- **Manifest Version:** 3
- **Permissions:** `tabs`, `storage`
- **UI:** Clean, professional interface following the Chrome Extension Framework styling.
- **Modularity:** Logic divided into UI rendering, tab manipulation, and session storage handlers.

## Setup
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" (top right toggle).
3. Click "Load unpacked" and select this directory.
