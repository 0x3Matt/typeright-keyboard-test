const textToTypeElement = document.getElementById('text-to-type');
const inputElement = document.getElementById('input');
const timeElement = document.getElementById('time');
const speedElement = document.getElementById('speed');
const accuracyElement = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');
const keyboardElement = document.getElementById('keyboard');

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "The journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "In the middle of difficulty lies opportunity."
];

const keys = [
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
    'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
    'Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter',
    'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift',
    ' '
];

let timer;
let time = 0;
let isTestStarted = false;
let textToType = '';

function createKeyboard() {
    keyboardElement.innerHTML = '';
    keys.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyElement.setAttribute('data-key', key);
        if (key === ' ') {
            keyElement.style.width = '200px';
        }
        keyboardElement.appendChild(keyElement);
    });
}

function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

function startTest() {
    if (!isTestStarted) {
        isTestStarted = true;
        timer = setInterval(() => {
            time++;
            timeElement.textContent = time;
        }, 1000);
    }
}

function endTest() {
    clearInterval(timer);
    isTestStarted = false;
    const typedText = inputElement.value;
    const wordsTyped = typedText.split(' ').length;
    const speed = Math.round((wordsTyped / time) * 60);
    speedElement.textContent = speed;

    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === textToType[i]) {
            correctChars++;
        }
    }
    const accuracy = Math.round((correctChars / textToType.length) * 100);
    accuracyElement.textContent = accuracy;
}

function resetTest() {
    clearInterval(timer);
    isTestStarted = false;
    time = 0;
    timeElement.textContent = time;
    speedElement.textContent = 0;
    accuracyElement.textContent = 100;
    inputElement.value = '';
    textToType = getRandomText();
    textToTypeElement.innerHTML = '';
    textToType.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        textToTypeElement.appendChild(charSpan);
    });
    createKeyboard();
}

function highlightKey(key) {
    const keyElement = document.querySelector(`[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, 100);
    }
}

inputElement.addEventListener('input', () => {
    startTest();
    const typedText = inputElement.value;
    const textChars = textToTypeElement.querySelectorAll('span');

    textChars.forEach((charSpan, index) => {
        const typedChar = typedText[index];
        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === charSpan.textContent) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
        }
    });

    if (typedText.length === textToType.length) {
        endTest();
    }
});

inputElement.addEventListener('keydown', (e) => {
    highlightKey(e.key);
});

resetBtn.addEventListener('click', resetTest);

resetTest();