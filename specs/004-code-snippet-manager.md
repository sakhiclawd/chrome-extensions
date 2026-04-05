# Chrome Extension #004: Code Snippet Manager

## Overview
- **Project Name**: Code Snippet Manager
- **Type**: Chrome Extension (Manifest V3)
- **Core Functionality**: Save, organize, search, and quickly access code snippets from any webpage
- **Target Users**: Developers who frequently collect and reuse code snippets

## UI/UX Specification

### Layout Structure
- **Popup**: Single-page interface (400x500px default)
  - Header with title and action buttons
  - Search bar
  - Category/tag filter
  - Snippet list (scrollable)
  - Add snippet modal (inline)

### Visual Design
- **Color Palette**:
  - Background: `#1a1a2e` (deep navy)
  - Surface: `#16213e` (dark blue)
  - Primary: `#0f3460` (medium blue)
  - Accent: `#e94560` (coral red)
  - Text Primary: `#eaeaea`
  - Text Secondary: `#a0a0a0`
  - Success: `#4ecca3`
  - Border: `#2a2a4a`

- **Typography**:
  - Font Family: `'JetBrains Mono', 'Fira Code', monospace` (code), `'Segoe UI', system-ui` (UI)
  - Headings: 16px bold
  - Body: 13px regular
  - Code: 12px monospace

- **Spacing**: 8px base unit (8, 16, 24, 32)

- **Visual Effects**:
  - Border radius: 8px (cards), 4px (inputs/buttons)
  - Box shadow: `0 2px 8px rgba(0,0,0,0.3)`
  - Hover transitions: 150ms ease

### Components
1. **Search Bar**: Icon + input field, instant filtering
2. **Category Pills**: Horizontal scrollable tags
3. **Snippet Card**: Title, language badge, preview (3 lines), actions (copy, edit, delete)
4. **Add/Edit Modal**: Title input, language selector, code textarea, tags input, save/cancel
5. **Empty State**: Illustration + CTA to add first snippet
6. **Toast Notifications**: Success/error feedback

## Functionality Specification

### Core Features
1. **Save Snippet**:
   - Capture selected text from webpage via context menu
   - Manual entry via popup form
   - Auto-detect language from content

2. **Organize Snippets**:
   - Categorize by language (JavaScript, Python, CSS, HTML, etc.)
   - Custom tags for flexible grouping
   - Star/favorite snippets

3. **Search & Filter**:
   - Full-text search across title, code, tags
   - Filter by language
   - Filter by tags
   - Sort by date added, name, or usage count

4. **Quick Access**:
   - One-click copy to clipboard
   - Keyboard shortcuts (Ctrl+Shift+V to open, Ctrl+F to search)
   - Recent snippets section

5. **Storage**:
   - Chrome Storage API (sync across devices)
   - Export/Import JSON backup

### User Interactions
- Click extension icon → Open popup
- Right-click selected text → "Save to Snippets"
- Click snippet card → Expand full view
- Click copy button → Copy to clipboard + toast
- Click star → Toggle favorite

### Edge Cases
- Empty snippet list → Show onboarding
- Very long code → Truncate preview, show full on expand
- Duplicate detection → Warn user
- Storage quota → Show warning when near limit

## Technical Architecture

### File Structure
```
extensions/code-snippet-manager/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── background/
│   └── background.js
├── content/
│   └── content.js
├── utils/
│   └── storage.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── _locales/
    └── en/
        └── messages.json
```

### Manifest V3 Permissions
- `storage` (for snippets data)
- `contextMenus` (right-click save)
- `clipboard` (copy functionality)
- `activeTab` (capture selected text)

## Acceptance Criteria
1. [ ] Extension installs without errors
2. [ ] Popup opens with clean UI matching spec colors
3. [ ] Can create new snippet with title, code, language, tags
4. [ ] Can search snippets by text
5. [ ] Can filter by language
6. [ ] Can copy snippet to clipboard
7. [ ] Can delete snippet
8. [ ] Can edit existing snippet
9. [ ] Context menu "Save to Snippets" works
10. [ ] Data persists across browser restarts
11. [ ] No console errors during normal operation