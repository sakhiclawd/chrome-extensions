# Chrome Extension Framework & Repo Details

## GitHub Repository
- **URL:** `https://github.com/sakhiclawd/chrome-extensions`
- **Local Path:** `/home/openclaw/.openclaw/agents/krit/workspace/Chrome-Extensions`
- **Structure:** All extensions live in the `extensions/` subfolder.

## V1 Reference: Briefly AI (ai-webpage-summary)
- **Location:** `extensions/ai-webpage-summary`
- **Purpose:** Extracts page content and provides a summary via the OpenClaw API.
- **Key Files:** 
    - `manifest.json`: Manifest V3 configuration.
    - `content.js`: Handles DOM extraction.
    - `popup.js/html`: The user interface for triggering summaries.

## The Goal
Build a library of 30+ extensions following this pattern. Each new extension should be placed in a new subfolder under `extensions/`.
