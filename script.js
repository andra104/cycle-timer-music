// Timer Variables
let workDuration = 25 * 60; // Default 25 min
let breakDuration = 5 * 60; // Default 5 min
let timeLeft = workDuration;
let isWorkSession = true;
let isRunning = false;
let timer;
let originalMusicURL = '';
let waveMusicURL = 'https://www.youtube.com/embed/your-wave-sounds-video-id'; // Replace with a real wave sound URL

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const loadMusicBtn = document.getElementById('load-music');
const musicUrlInput = document.getElementById('music-url');
const musicPlayer = document.getElementById('music-player');
const workInput = document.getElementById('work-duration'); // Add input for work duration in HTML
const breakInput = document.getElementById('break-duration'); // Add input for break duration in HTML

// Sounds
const notificationSound = new Audio('notification.mp3'); // Add a notification sound file

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
      sessionSwitch();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  timeLeft = workDuration;
  updateTimerDisplay();
  loadMusic(originalMusicURL); // Reset to original music
}

function sessionSwitch() {
  // Play notification sound
  notificationSound.play();

  if (isWorkSession) {
    // Switch to break session
    isWorkSession = false;
    timeLeft = breakDuration;
    loadMusic(waveMusicURL); // Switch to wave sounds
  } else {
    // Switch back to work session
    isWorkSession = true;
    timeLeft = workDuration;
    loadMusic(originalMusicURL); // Resume original music
  }

  updateTimerDisplay();
  startTimer(); // Automatically start next session
}

// Music Integration
function loadMusic(url) {
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

// Set Custom Durations
function setCustomDurations() {
  const workInputValue = parseInt(workInput.value, 10);
  const breakInputValue = parseInt(breakInput.value, 10);

  if (!isNaN(workInputValue) && workInputValue > 0) {
    workDuration = workInputValue * 60;
  }

  if (!isNaN(breakInputValue) && breakInputValue > 0) {
    breakDuration = breakInputValue * 60;
  }

  resetTimer();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
loadMusicBtn.addEventListener('click', () => {
  originalMusicURL = musicUrlInput.value;
  loadMusic(originalMusicURL);
});
workInput.addEventListener('change', setCustomDurations);
breakInput.addEventListener('change', setCustomDurations);

// Initialize Timer Display
updateTimerDisplay();
