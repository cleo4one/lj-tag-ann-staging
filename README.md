# JINAIR TAG Announcement Player — 20261004.3

Static mobile-first airport announcement player for the JINAIR TAG branch.

Current build: **20261004.5** with 16 standard announcements plus Custom Announcement.

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


## Announcement 16 — Passenger Paging (General)

Announcement 16 supports:

- Destination buttons: ICN / PUS (synchronized with the top destination control)
- Passenger name input with optional Convert Name to Korean
- Independent name repeat count, default 2
- Location buttons: CNTR / GATE / CNTR or GATE
- Spoken Korean location mapping: 카운터 / 탑승구 / 카운터나 탑승구
- Default location: GATE
- Dynamic English reference


## 20261004.5 — header and codeshare controls

- The top-left brand now reads `JIN AIR`.
- `Keep Awake` has moved from Voice Engine Settings into the top header.
- A compact `Codeshare` toggle sits next to the flight selector.
- With Codeshare enabled, LJ044 shows `CS KE5768` beneath the primary flight number. LJ046 stays unchanged because no codeshare is configured for it.
- Korean templates that use `{flightNumber}` automatically expand LJ044 to `LJ044편, 공동운항 대한항공 KE5768편` in display text, while TTS receives pronunciation-optimized Korean.
- English references render LJ044 as `LJ044 (Korean Air codeshare KE5768)` when the option is enabled.
- The Codeshare preference is saved locally and remains enabled while switching flights; it only affects flights that have a configured codeshare mapping.
