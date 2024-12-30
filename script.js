// Timer Variables
let workDuration = 25 * 60; // Default 25 min
let breakDuration = 5 * 60; // Default 5 min
let timeLeft = workDuration;
let isWorkSession = true;
let isRunning = false;
let timer;

// Video URLs
let workVideoURL = '';
let breakVideoURL = '';
let useSameVideo = false;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const loadWorkMusicBtn = document.getElementById('load-work-music');
const loadBreakMusicBtn = document.getElementById('load-break-music');
const sameVideoCheckbox = document.getElementById('same-video');
const workMusicUrlInput = document.getElementById('work-music-url');
const breakMusicUrlInput = document.getElementById('break-music-url');
const musicPlayer = document.getElementById('music-player');
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');

// Notification Sounds
const break_will_start = new Audio('break_will_start.m4a'); // 5 min before work ends
const break_has_started = new Audio('break_has_started.m4a'); // At break start
const work_will_start = new Audio('work_will_start.m4a'); // 1 min before break ends
const work_has_started = new Audio('work_has_started.m4a'); // At work restart

// Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  // Auto-play the video
  if (isWorkSession) {
    loadMusic(workVideoURL, true);
  } else {
    loadMusic(breakVideoURL, true);
  }

  timer = setInterval(() => {
    if (isWorkSession && timeLeft === 5 * 60 && workDuration > 5 * 60) {
      // Play warning only if work session is more than 5 minutes
      break_will_start.play();
    }

    if (!isWorkSession && timeLeft === 60 && breakDuration > 60) {
      // Play warning only if break session is more than 1 minute
      work_will_start.play();
    }

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
  loadMusic(workVideoURL); // Reset to original work music
}

function sessionSwitch() {
  if (isWorkSession) {
    // Switch to break session
    isWorkSession = false;
    timeLeft = breakDuration;

    break_has_started.play(); // Break starts

    if (!useSameVideo && breakVideoURL) {
      loadMusic(breakVideoURL, true);
    }
  } else {
    // Switch back to work session
    isWorkSession = true;
    timeLeft = workDuration;

    work_has_started.play(); // Work starts
    loadMusic(workVideoURL, true);
  }

  updateTimerDisplay();
  startTimer(); // Automatically start next session
}

// Music Integration
function loadMusic(url, autoplay = false) {
  if (url.includes('youtube.com')) {
    musicPlayer.innerHTML = `
      <iframe width="100%" height="200" 
        src="${url.replace('watch?v=', 'embed/')}${autoplay ? '?autoplay=1' : ''}" 
        frameborder="0" allow="autoplay; encrypted-media" 
        allowfullscreen>
      </iframe>`;
  } else {
    alert('Please enter a valid YouTube Music URL');
  }
}

// Set Custom Durations with Decimal Support
function setCustomDurations() {
  const workInputValue = parseFloat(workInput.value); // Parse as float
  const breakInputValue = parseFloat(breakInput.value); // Parse as float

  if (!isNaN(workInputValue) && workInputValue > 0) {
    workDuration = Math.round(workInputValue * 60); // Convert to seconds
  }

  if (!isNaN(breakInputValue) && breakInputValue > 0) {
    breakDuration = Math.round(breakInputValue * 60); // Convert to seconds
  }

  resetTimer();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

loadWorkMusicBtn.addEventListener('click', () => {
  workVideoURL = workMusicUrlInput.value;
  loadMusic(workVideoURL);
});

loadBreakMusicBtn.addEventListener('click', () => {
  breakVideoURL = breakMusicUrlInput.value;
  if (useSameVideo) {
    breakVideoURL = workVideoURL;
  }
});

sameVideoCheckbox.addEventListener('change', (e) => {
  useSameVideo = e.target.checked;
  if (useSameVideo) {
    breakVideoURL = workVideoURL;
  }
});

workInput.addEventListener('change', setCustomDurations);
breakInput.addEventListener('change', setCustomDurations);

// Initialize Timer Display
updateTimerDisplay();
