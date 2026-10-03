# 20261004.6

- Compact codeshare label: `(KE5768)` instead of a separate `CS` line.
- Removed card summary subtitles and voice helper text.
- Simplified duplicate Standard Announcements / Custom Announcement headings.
- Grouped linked input fields and repeat controls into compact rows.
- Standardized visible/PWA branding to `JIN AIR`.
- Restored project URL and creator credit in the footer.

# 20261004.5

- Moved the `Keep Awake` control into the top header next to the branch branding.
- Changed the top-left brand label from `JINAIR` to `JIN AIR`.
- Added a persistent `Codeshare` toggle next to the flight selector.
- LJ044 now displays `CS KE5768` when Codeshare is enabled; LJ046 remains unchanged.
- Korean flight-number placeholders automatically include `공동운항 대한항공 KE5768` for LJ044 when Codeshare is enabled, including pronunciation-optimized TTS text.
- English references also include the Korean Air codeshare flight where applicable.
- Added a data-level `codeshares` mapping so future codeshare flights can be maintained without editing announcement templates.

# 20261004.4

- Added Announcement 16: **Passenger Paging (General)**.
- Added per-announcement ICN/PUS destination buttons synchronized with the top destination selector.
- Added passenger-name input, MyMemory name conversion, and independent name repeat control (default: 2).
- Added location buttons: **CNTR**, **GATE**, and **CNTR or GATE**; spoken Korean values are **카운터**, **탑승구**, and **카운터나 탑승구**. Default location is **GATE**.
- Added a dynamic English reference for Announcement 16.
- Added reusable data-driven `destination` and `choice` input types for future announcements.
- Existing Announcements 1–15 remain unchanged.

# Changelog

## 20261004.3

- Converted all application UI text to English while preserving announcement scripts in their original operational language.
- Removed the KO/EN detected-voice count indicator from the Voice Engine Settings header.
- Simplified destination buttons to `ICN` and `PUS` only; Korean airport names are still retained internally for Korean announcement generation.
- Added a **Keep Screen Awake** option using the Screen Wake Lock API.
  - Preference is stored locally.
  - The lock is requested after the app is started.
  - The app attempts to reacquire it when returning to the visible page.
  - Unsupported/insecure environments show the option as unavailable.
- Added English UI labels, validation messages, playback controls, guide text, translation controls, and modal messages.
- Kept Korean pronunciation logic and Korean TTS preview speech unchanged because those are speech behavior rather than UI language.
- Updated the service-worker cache version to `lj-tag-ann-v20261004-3`.

## 20261004.2

- Added category icons and accent colors to announcement headers.
- Opening an announcement aligns its header below the sticky flight/destination header.
- Disabled page zoom/pinch zoom for the operational mobile UI.
- Shortened the settings title.

## 20261004.1

- Initial rebuilt production-oriented version using external announcement data, local CSS, improved TTS segmentation, persistence, PWA support, and restored production announcement wording.
