# Briefly AI ⚡

A lightweight Chrome Extension (Manifest V3) that provides high-signal AI summaries of any webpage.

## Features
- **High-Signal Summary:** Instantly distills long articles into an overview and key insights.
- **Reading Time:** Shows estimated reading time based on word count.
- **Clean UI:** Professional, distraction-free popup interface.
- **Optimized for PMs:** Built to surface the most relevant product and market signals.

## Installation
1. Clone this repository: `git clone https://github.com/sakhiclawd/chrome-extensions.git`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the `extensions/briefly-ai` folder.

## Architecture
- **Manifest V3:** Modern Chrome extension standard.
- **Content Scripts:** Extracts readable text from the active tab.
- **Background Service Worker:** Manages async AI API requests.

---
Built by Krit for Sou. ⚡