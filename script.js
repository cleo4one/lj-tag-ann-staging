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

// 1. Prevent Pinch Zoom & Gestures
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

// 2. Start Overlay Click Handler
btnStart.addEventListener('click', () => {
    initVoices();
    startOverlay.style.display = 'none';
});

// 3. Populate Voices
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

// 4. Flight & Destination Selector Logic
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

// 5. Update Template Placeholders
function updateAllTemplates() {
    document.querySelectorAll('.ann-card').forEach(card => {
        const textElem = card.querySelector('.ann-text');
        const gateInput = card.querySelector('.input-gate');
        if (!textElem) return;

        let template = textElem.getAttribute('data-template');
        let flightSpoken = currentFlight === 'LJ044' ? '엘제이 공 사 사' : '엘제이 공 사 육';
        let destSpoken = destNames[currentDest] || '인천';
        let gateVal = gateInput ? gateInput.value : '1';

        let result = template
            .replace(/{destination}/g, destSpoken)
            .replace(/{flightNumber}/g, flightSpoken)
            .replace(/{gate}/g, gateVal);

        textElem.textContent = result;
    });
}

// 6. Accordion Toggle
document.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isHidden = body.classList.contains('hidden');
        
        // Close other accordion cards
        document.querySelectorAll('.card-body').forEach(b => b.classList.add('hidden'));
        
        if (isHidden) {
            body.classList.remove('hidden');
        }
    });
});

// 7. Gate Input Event Listener
document.querySelectorAll('.input-gate').forEach(input => {
    input.addEventListener('input', updateAllTemplates);
});

// 8. Playback with Highlighting and Progress Bar
document.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.ann-card');
        const textElem = card.querySelector('.ann-text');
        const progressFill = card.querySelector('.progress-bar-fill');

        if (synth.speaking) {
            synth.cancel();
            resetCardUI(card);
            if (currentCard === card) {
                currentCard = null;
                return;
            }
        }

        currentCard = card;
        const text = textElem.textContent.trim();
        const words = text.split(' ');
        
        // Wrap words in span tags for word-by-word highlighting
        textElem.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
        const spans = textElem.querySelectorAll('span');

        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Voice assignment
        if (voices.length > 0 && selVoiceKo.value) {
            currentUtterance.voice = voices[selVoiceKo.value];
        }

        // Boundary Event: Highlight and Update Progress Bar
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

        currentUtterance.onend = () => {
            resetCardUI(card);
            currentCard = null;
        };

        currentUtterance.onerror = () => {
            resetCardUI(card);
            currentCard = null;
        };

        synth.speak(currentUtterance);
    });
});

// Stop Playback
document.querySelectorAll('.btn-stop').forEach(btn => {
    btn.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
        }
        if (currentCard) {
            resetCardUI(currentCard);
            currentCard = null;
        }
    });
});

function resetCardUI(card) {
    if (!card) return;
    const textElem = card.querySelector('.ann-text');
    const progressFill = card.querySelector('.progress-bar-fill');
    
    if (progressFill) progressFill.style.width = '0%';
    if (textElem) {
        textElem.querySelectorAll('span').forEach(s => s.className = '');
    }
}

// Initial Template Set
updateAllTemplates();