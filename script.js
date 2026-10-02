// State Management
let currentFlight = 'LJ044';
let currentDest = 'ICN';
const destNames = { ICN: '인천', PUS: '부산' };

let synth = window.speechSynthesis;
let voices = [];

// Track Playback State
let activeCard = null;
let isPaused = false;

// DOM Elements
const startOverlay = document.getElementById('startOverlay');
const btnStart = document.getElementById('btnStart');
const selVoiceKo = document.getElementById('selVoiceKo');
const selVoiceEn = document.getElementById('selVoiceEn');
const rngSpeed = document.getElementById('rngSpeed');
const rngPitch = document.getElementById('rngPitch');
const lblSpeed = document.getElementById('lblSpeed');
const lblPitch = document.getElementById('lblPitch');

// Gesture Prevention
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

// Start Overlay Click
btnStart.addEventListener('click', () => {
    initVoices();
    startOverlay.style.display = 'none';
});

// Slider Updates
rngSpeed.addEventListener('input', (e) => lblSpeed.textContent = e.target.value);
rngPitch.addEventListener('input', (e) => lblPitch.textContent = e.target.value);

// Voice Init
function initVoices() {
    voices = synth.getVoices();
    selVoiceKo.innerHTML = '';
    selVoiceEn.innerHTML = '';

    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        
        if (voice.lang.includes('ko')) {
            selVoiceKo.appendChild(option);
        } else if (voice.lang.includes('en')) {
            selVoiceEn.appendChild(option);
        }
    });
}
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = initVoices;
}

// Language Segment Parser (Korean vs English Voice Separation)
function parseTextToSegments(text) {
    const segments = [];
    const regex = /([A-Za-z0-9\s.,!?-]+)|([^A-Za-z0-9\s.,!?-]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
            segments.push({ text: match[1], lang: 'en' });
        } else if (match[2]) {
            segments.push({ text: match[2], lang: 'ko' });
        }
    }
    return segments;
}

// Repeat Buttons Logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-repeat-plus')) {
        const span = e.target.previousElementSibling;
        let val = parseInt(span.textContent) || 1;
        span.textContent = val + 1;
        updateAllTemplates();
    } else if (e.target.classList.contains('btn-repeat-minus')) {
        const span = e.target.nextElementSibling;
        let val = parseInt(span.textContent) || 1;
        if (val > 1) span.textContent = val - 1;
        updateAllTemplates();
    }
});

// MyMemory Translation API Call
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-translate')) {
        const card = e.target.closest('.ann-card');
        const textarea = card.querySelector('.input-names');
        const query = textarea.value.trim();
        if (!query) return;

        e.target.textContent = '번역 중...';
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|ko`);
            const data = await res.json();
            if (data && data.responseData && data.responseData.translatedText) {
                textarea.value = data.responseData.translatedText;
                updateAllTemplates();
            }
        } catch (err) {
            alert('번역 서버 연결 실패. 수동으로 입력해 주세요.');
        } finally {
            e.target.textContent = '영문 이름 한글 번역';
        }
    }
});

// Template Updates with Repetition
function updateAllTemplates() {
    document.querySelectorAll('.ann-card').forEach(card => {
        const textElem = card.querySelector('.ann-text');
        if (!textElem) return;

        let template = textElem.getAttribute('data-template');
        if (!template) return;

        let flightSpoken = currentFlight === 'LJ044' ? '엘제이 공 사 사' : '엘제이 공 사 육';
        let destSpoken = destNames[currentDest] || '인천';
        
        const gateInput = card.querySelector('.input-gate');
        let gateVal = gateInput ? gateInput.value : '1';

        const nameInput = card.querySelector('.input-names');
        let namesVal = nameInput && nameInput.value.trim() !== '' ? nameInput.value.trim() : '';

        // Repeat Logic
        const repeatSpan = card.querySelector('.repeat-val');
        const repeatCount = repeatSpan ? parseInt(repeatSpan.textContent) || 1 : 1;

        if (namesVal && repeatCount > 1) {
            namesVal = Array(repeatCount).fill(namesVal).join(', ');
        }
        if (gateVal && repeatCount > 1 && template.includes('{gate}번')) {
            const repeatedGate = Array(repeatCount).fill(`${gateVal}번`).join(', ');
            template = template.replace('{gate}번', repeatedGate);
        }

        let result = template
            .replace(/{destination}/g, destSpoken)
            .replace(/{flightNumber}/g, flightSpoken)
            .replace(/{gate}/g, gateVal)
            .replace(/{names}/g, namesVal);

        textElem.textContent = result;
    });
}

// Accordion Toggle
document.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isHidden = body.classList.contains('hidden');
        
        // Stop current speech when toggling accordion
        stopSpeech();
        document.querySelectorAll('.card-body').forEach(b => b.classList.add('hidden'));
        if (isHidden) body.classList.remove('hidden');
    });
});

// Play / Pause / Resume Logic
document.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.ann-card');

        // 1. Same Card Clicked while Speaking -> Toggle Pause / Resume
        if (activeCard === card) {
            if (synth.speaking && !synth.paused) {
                synth.pause();
                isPaused = true;
                e.target.textContent = '▶ 계속 재생 (Resume)';
                return;
            } else if (synth.paused) {
                synth.resume();
                isPaused = false;
                e.target.textContent = '❚❚ 일시정지 (Pause)';
                return;
            }
        }

        // 2. Different Card or New Play -> Stop and Start Fresh
        stopSpeech();
        activeCard = card;
        e.target.textContent = '❚❚ 일시정지 (Pause)';

        const textElem = card.querySelector('.ann-text');
        const progressFill = card.querySelector('.progress-bar-fill');
        const text = textElem.textContent.trim();

        const words = text.split(' ');
        textElem.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
        const spans = textElem.querySelectorAll('span');

        const segments = parseTextToSegments(text);
        let currentSegmentIdx = 0;

        function speakNextSegment() {
            if (currentSegmentIdx >= segments.length) {
                resetCardUI(card);
                stopSpeech();
                return;
            }

            const seg = segments[currentSegmentIdx];
            const utterance = new SpeechSynthesisUtterance(seg.text);
            utterance.rate = parseFloat(rngSpeed.value);
            utterance.pitch = parseFloat(rngPitch.value);

            if (voices.length > 0) {
                if (seg.lang === 'en' && selVoiceEn.value) {
                    utterance.voice = voices[selVoiceEn.value];
                } else if (selVoiceKo.value) {
                    utterance.voice = voices[selVoiceKo.value];
                }
            }

            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    const charIdx = event.charIndex;
                    let currentLen = 0;

                    spans.forEach((span, idx) => {
                        const spanLen = span.textContent.length;
                        if (charIdx >= currentLen && charIdx < currentLen + spanLen + 1) {
                            span.className = 'hl-word';
                            const pct = Math.min(100, Math.round(((idx + 1) / spans.length) * 100));
                            if (progressFill) progressFill.style.width = pct + '%';
                        } else {
                            span.className = '';
                        }
                        currentLen += spanLen + 1;
                    });
                }
            };

            utterance.onend = () => {
                currentSegmentIdx++;
                speakNextSegment();
            };

            utterance.onerror = () => {
                resetCardUI(card);
                stopSpeech();
            };

            synth.speak(utterance);
        }

        speakNextSegment();
    });
});

// Stop Button Logic
document.querySelectorAll('.btn-stop').forEach(btn => {
    btn.addEventListener('click', () => {
        stopSpeech();
    });
});

function stopSpeech() {
    if (synth.speaking || synth.paused) {
        synth.cancel();
    }
    if (activeCard) {
        resetCardUI(activeCard);
        activeCard = null;
    }
    isPaused = false;
}

function resetCardUI(card) {
    if (!card) return;
    const btnPlay = card.querySelector('.btn-play');
    const textElem = card.querySelector('.ann-text');
    const progressFill = card.querySelector('.progress-bar-fill');

    if (btnPlay) btnPlay.textContent = '▶ 재생 / 일시정지';
    if (progressFill) progressFill.style.width = '0%';
    if (textElem) textElem.querySelectorAll('span').forEach(s => s.className = '');
}

// Initial Setup
updateAllTemplates();
