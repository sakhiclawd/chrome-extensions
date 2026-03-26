# Competitor Website Analyzer

## Overview
A Manifest V3 Chrome extension providing real-time competitor snapshots (traffic, keywords, backlinks) and seamless integration with the **PMLibrary** platform.

## Architecture
- **`manifest.json`**: Manifest V3 configuration with strict host permissions for `pmdirectory.net`.
- **`background.js`**: Service worker handling asynchronous API calls to PMLibrary and managing data flow.
- **`content.js`**: Lightweight script for active tab domain detection and normalization.
- **`popup.js`**: UI controller managing tab states and data rendering.
- **`popup.html`**: Tabbed interface for structured domain metrics.

## Features
- **Domain Normalization**: Automatically extracts the root domain from any active tab.
- **Multi-Metric View**: Displays traffic estimates, SEO visibility, and backlink authority profiles.
- **One-Click Save**: Pushes domain snapshots to the user's PMLibrary account via a REST API.
- **Modular Data Handling**: Backend logic separated into service workers to ensure long-running task reliability.

## Permissions & Security
- `activeTab`: Required for domain detection on the current website.
- `storage`: For local caching of recent analyses.
- `host_permissions`: Strictly limited to `https://www.pmdirectory.net/*` to ensure cross-origin request security.

## Development Status
- **Current Version**: 1.0.1 (Production Stable)
- **Completed**: Core UI, background communication framework, domain detection, API integration, and rebranding.
- **Next**: Add comparative domain analysis (side-by-side view).
