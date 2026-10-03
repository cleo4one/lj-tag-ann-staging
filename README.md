# JINAIR TAG Announcement Player

정적 HTML/CSS/JavaScript 기반 공항 안내방송 TTS 플레이어입니다. 서버 백엔드는 필요하지 않습니다.

## 파일 구조

- `index.html` — 화면 골격만 담당합니다. 방송문은 들어 있지 않습니다.
- `styles.css` — Tailwind Play CDN을 대체하는 자체 스타일입니다.
- `app.js` — TTS, 음성 선택, 재생/일시정지/정지, 입력 검증, 하이라이트, 번역 기능을 담당합니다.
- `data/announcements.js` — **15개 표준 방송의 제목, 원문, 영어 참고 번역, 입력 필드/반복 규칙을 편집하는 파일**입니다.
- `manifest.webmanifest`, `service-worker.js` — HTTPS 배포 시 홈 화면/PWA 및 핵심 파일 오프라인 캐시를 지원합니다.
- `icon*.png` — 앱 아이콘입니다.

## 방송문 수정

`data/announcements.js`만 수정하면 됩니다. `{flightNumber}`, `{destination}`, `{gate}` 등의 placeholder 이름은 유지해 주세요.

## 외부 네트워크 의존성

핵심 UI와 TTS에는 외부 CDN이 없습니다. 기기 내장 Web Speech API를 사용합니다. `영문 이름 한글 번역` 버튼만 MyMemory API를 사용하므로 인터넷 연결이 필요합니다. 번역 서비스가 실패해도 나머지 방송 기능에는 영향을 주지 않습니다.

## 배포 참고

서비스 워커는 HTTPS 또는 localhost에서만 등록됩니다. 단순 `file://`로 열어도 핵심 페이지와 TTS 기능은 사용할 수 있지만 PWA 캐시는 동작하지 않습니다.
