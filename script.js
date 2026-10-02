// State Management
let currentFlight = 'LJ044';
let currentDest = 'ICN';
const destNames = { ICN: '인천', PUS: '부산' };

let synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;
let currentCard = null;

// DOM Elements
const startOverlay = document.getElementById('startOverlay');
const btnStart = document.getElementById('btnStart');
const selVoiceKo = document.getElementById('selVoiceKo');
const selVoiceEn = document.getElementById('selVoiceEn');
const rngSpeed = document.getElementById('rngSpeed');
const rngPitch = document.getElementById('rngPitch');
const lblSpeed = document.getElementById('lblSpeed');
const lblPitch = document.getElementById('lblPitch');

// 1. Zoom and Gesture Prevention
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

// 2. Start Overlay Event
btnStart.addEventListener('click', () => {
    initVoices();
    startOverlay.style.display = 'none';
});

// 3. Sliders UI Event
rngSpeed.addEventListener('input', (e) => lblSpeed.textContent = e.target.value);
rngPitch.addEventListener('input', (e) => lblPitch.textContent = e.target.value);

// 4. Voice Initialization
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

// 5. Flight & Destination Buttons
document.querySelectorAll('.btn-flight').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-flight').forEach(b => {
            b.classList.remove('bg-lj-lime', 'text-slate-950');
            b.classList.add('text-slate-400');
        });
        e.target.classList.add('bg-lj-lime', 'text-slate-950');
        e.target.classList.remove('text-slate-400');
        currentFlight = e.target.getAttribute('data-val');
        updateAllTemplates();
    });
});

document.querySelectorAll('.btn-dest').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-dest').forEach(b => {
            b.classList.remove('bg-lj-lime', 'text-slate-950');
            b.classList.add('text-slate-400');
        });
        e.target.classList.add('bg-lj-lime', 'text-slate-950');
        e.target.classList.remove('text-slate-400');
        currentDest = e.target.getAttribute('data-val');
        updateAllTemplates();
    });
});

// 6. Template Placeholder Updater
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

        const delayHInput = card.querySelector('.input-delay-h');
        const delayMInput = card.querySelector('.input-delay-m');
        let delayHVal = delayHInput ? delayHInput.value : '0';
        let delayMVal = delayMInput ? delayMInput.value : '0';

        let result = template
            .replace(/{destination}/g, destSpoken)
            .replace(/{flightNumber}/g, flightSpoken)
            .replace(/{gate}/g, gateVal)
            .replace(/{names}/g, namesVal)
            .replace(/{delayH}/g, delayHVal)
            .replace(/{delayM}/g, delayMVal);

        textElem.textContent = result;
    });
}

// 7. Inputs Event Watcher
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-gate') ||
        e.target.classList.contains('input-names') ||
        e.target.classList.contains('input-delay-h') ||
        e.target.classList.contains('input-delay-m')) {
        updateAllTemplates();
    }
});

// 8. Accordion Toggle
document.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isHidden = body.classList.contains('hidden');
        document.querySelectorAll('.card-body').forEach(b => b.classList.add('hidden'));
        if (isHidden) body.classList.remove('hidden');
    });
});

// 9. Playback Logic
document.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.ann-card');
        const textElem = card.querySelector('.ann-text');
        const isEnglish = e.target.getAttribute('data-lang') === 'en';
        playAnnouncement(card, textElem.textContent.trim(), isEnglish);
    });
});

const btnCustomPlay = document.querySelector('.btn-play-custom');
if (btnCustomPlay) {
    btnCustomPlay.addEventListener('click', (e) => {
        const card = e.target.closest('.ann-card');
        const inputCustom = card.querySelector('.input-custom');
        const text = inputCustom.value.trim();
        if (text) playAnnouncement(card, text, false);
    });
}

function playAnnouncement(card, text, isEnglish = false) {
    const textElem = card.querySelector('.ann-text');
    const progressFill = card.querySelector('.progress-bar-fill');

    if (synth.speaking) {
        synth.cancel();
        resetCardUI(currentCard);
        if (currentCard === card) {
            currentCard = null;
            return;
        }
    }

    currentCard = card;
    if (textElem.classList.contains('hidden')) textElem.classList.remove('hidden');

    const words = text.split(' ');
    textElem.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
    const spans = textElem.querySelectorAll('span');

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = parseFloat(rngSpeed.value);
    currentUtterance.pitch = parseFloat(rngPitch.value);

    if (voices.length > 0) {
        if (isEnglish && selVoiceEn.value) {
            currentUtterance.voice = voices[selVoiceEn.value];
        } else if (selVoiceKo.value) {
            currentUtterance.voice = voices[selVoiceKo.value];
        }
    }

    currentUtterance.onboundary = (event) => {
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

    currentUtterance.onend = () => { resetCardUI(card); currentCard = null; };
    currentUtterance.onerror = () => { resetCardUI(card); currentCard = null; };

    synth.speak(currentUtterance);
}

// Stop Button
document.querySelectorAll('.btn-stop').forEach(btn => {
    btn.addEventListener('click', () => {
        if (synth.speaking) synth.cancel();
        if (currentCard) { resetCardUI(currentCard); currentCard = null; }
    });
});

function resetCardUI(card) {
    if (!card) return;
    const textElem = card.querySelector('.ann-text');
    const progressFill = card.querySelector('.progress-bar-fill');
    if (progressFill) progressFill.style.width = '0%';
    if (textElem) textElem.querySelectorAll('span').forEach(s => s.className = '');
}

// Init Setup
updateAllTemplates();
