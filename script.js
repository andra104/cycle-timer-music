// Timer Variables
let timer;
let isRunning = false;
let timeLeft = 25 * 60; // 25 minutes

// Timer DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const loadMusicBtn = document.getElementById('load-music');
const musicUrlInput = document.getElementById('music-url');
const musicPlayer = document.getElementById('music-player');

// Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      alert('Time is up! Take a break.');
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

// Music Integration
function loadMusic() {
  const url = musicUrlInput.value;
  if (url.includes('youtube.com')) {
    musicPlayer.innerHTML = `
      <iframe width="100%" height="200" 
        src="${url.replace('watch?v=', 'embed/')}" 
        frameborder="0" allow="autoplay; encrypted-media" 
        allowfullscreen>
      </iframe>`;
  } else {
    alert('Please enter a valid YouTube Music URL');
  }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
loadMusicBtn.addEventListener('click', loadMusic);

// Initialize Timer Display
updateTimerDisplay();
