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
