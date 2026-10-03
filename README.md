# JINAIR TAG Announcement Player — 20261004.3

Static mobile-first airport announcement player for the JINAIR TAG branch.

## Files

- `index.html` — application shell and English UI
- `styles.css` — bundled local styling; no Tailwind Play CDN
- `app.js` — rendering, TTS, translation, playback, persistence, wake lock, and UI logic
- `data/announcements.js` — announcement wording and announcement-specific input rules
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — app-shell caching with network-first updates

## Announcement content

Operational announcement scripts remain in `data/announcements.js`. The Korean/English announcement wording is intentionally separate from the English application UI.

## Keep Screen Awake

The **Keep Screen Awake** switch uses the Screen Wake Lock API. It requires browser support and a secure context (normally HTTPS). When enabled, the preference is saved locally and the app attempts to reacquire the lock when the page becomes visible again.

## iPhone TTS voices

The app can only select voices that Safari/WebKit exposes through `speechSynthesis.getVoices()`. iPhone Safari may expose a limited subset of installed voices. The webpage cannot create or force additional native iOS voices. Adding third-party/cloud TTS would require a separate online TTS provider and a secure backend/serverless proxy for credentials.

## External dependency

Core UI and local device TTS do not require Tailwind, Google Fonts, or GitHub assets. The optional passenger-name translation feature uses the MyMemory web API and therefore requires internet access.
