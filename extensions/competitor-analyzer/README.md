# Competitor Website Analyzer

## Overview
A high-performance Chrome extension built on Manifest V3 that provides instant competitor metrics for any active website. It is designed to bridge the gap between browsing a competitor's site and logging actionable data into the **PMLibrary**.

## Architecture
- **Framework:** Vanilla JavaScript, Modular Manifest V3.
- **Components:**
    - `background.js`: Service worker for lifecycle management and potential proxy handling.
    - `content.js`: Isolated world script for URL detection and domain normalization.
    - `popup.js/html`: Responsive tabbed UI for data visualization.
- **Storage:** Local storage for session caching, PMLibrary API for persistence.

## Key Features
- **Instant Traffic Pulse:** Monthly visits, bounce rate, and avg. duration.
- **SEO Visibility:** Ranking keyword counts and estimated organic strength.
- **Authority Tracking:** Backlink volume and referring domain counts.
- **PMLibrary Sync:** One-click "Save Snapshot" to store domain data in the central repository.

## Installation
1. Navigate to `chrome://extensions/`
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extensions/competitor-analyzer` folder.

## Technical Notes
- **V3 Compliance:** Uses `action` instead of `browser_action`.
- **Domain Normalization:** Smart detection of root domains vs. subdomains.
- **UI Styling:** Standardized Blue/Slate palette for professional engineering look.
