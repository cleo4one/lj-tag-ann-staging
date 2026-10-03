# 2026-10-04 rebuild

## Retained from the new prototype
- Dark navy/lime mobile card design
- One-tap LJ044/LJ046 and ICN/PUS controls
- Unified accordion announcement cards
- Original-template approach that avoids destructive placeholder replacement

## Restored/improved from the production version
- Exact production announcement wording for all 15 standard announcements
- Independent name/gate repetition for #9
- Floor + gate repetition for #10
- Gate 8/9/10 lower-floor directions for #11
- Estimated boarding clock-time entry and repetition for #14/#15
- Generic flight-number pronunciation formatter
- Separate Korean/English device voices
- Voice preview, rate/pitch preview and reset
- Voice loading retry/fallback and TTS keep-alive
- Flight/destination/voice/rate/pitch preference persistence
- English reference translations with live placeholder substitution
- Name translation with graceful failure and in-session caching

## Bugs/risks addressed
- Removed Tailwind Play CDN and external UI/font/SVG dependencies
- Moved announcement data out of HTML into `data/announcements.js`
- Fixed destructive template mutation from the old version
- Fixed the prototype's number/space-as-English segmentation bug
- Restored global character offsets for mixed-language progress/highlighting
- Removed unsafe user-text highlighting through `innerHTML`
- Added validation for required names, gate/floor ranges and time ranges
- Removed pinch-zoom blocking
- Added manifest/service worker for HTTPS PWA/offline app-shell use
- Service worker uses network-first behavior to reduce stale deployed content
