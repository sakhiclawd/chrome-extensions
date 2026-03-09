# AI Webpage Summary 🌸

A lightweight Chrome Extension (Manifest V3) that provides one-click summaries of any webpage using AI.

## Features
- **1-Click Summary:** Instantly distills long articles into an overview and key bullet points.
- **Reading Time:** Shows estimated reading time based on word count.
- **Clean UI:** Simple, distraction-free popup interface.
- **Export to Notion:** (Planned) Integrated export for personal knowledge management.

## Installation
1. Clone this repository: `git clone git@github.com:sakhiclawd/ai-webpage-summary.git`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the `ai-webpage-summary` folder.

## Architecture
- **Manifest V3:** Modern Chrome extension standard.
- **Content Scripts:** Extracts readable text from the active tab.
- **Background Service Worker:** Manages async AI API requests.
- **Backend:** Designed to work with Node.js/TypeScript on Vercel or Cloudflare Workers.

## Development
To connect to your own AI service, update the `generateSummary` function in `background.js` to point to your backend endpoint.

---
Built by Sakhi for Sou. 🌸