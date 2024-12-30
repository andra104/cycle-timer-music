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
let currentVideoURL = ''; // Tracks the currently loaded video URL

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

  // Auto-play the video only if it's not already playing
  if (useSameVideo) {
    if (currentVideoURL !== workVideoURL && workVideoURL) {
      loadMusic(workVideoURL, true);
      currentVideoURL = workVideoURL;
    }
  } else {
    if (isWorkSession) {
      loadMusic(workVideoURL, true);
      currentVideoURL = workVideoURL;
    } else {
      loadMusic(breakVideoURL, true);
      currentVideoURL = breakVideoURL;
    }
  }

  timer = setInterval(() => {
    if (
      isWorkSession && 
      timeLeft === 5 * 60 && 
      workDuration > 5 * 60
    ) {
      break_will_start.play();
    }

    if (
      !isWorkSession && 
      timeLeft === 60 && 
      breakDuration > 60
    ) {
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
  currentVideoURL = workVideoURL;
}

function sessionSwitch() {
  if (isWorkSession) {
    // Switch to break session
    isWorkSession = false;
    timeLeft = breakDuration;

    break_has_started.play(); // Break starts

    if (!useSameVideo && breakVideoURL) {
      loadMusic(breakVideoURL, true);
      currentVideoURL = breakVideoURL;
    }
  } else {
    // Switch back to work session
    isWorkSession = true;
    timeLeft = workDuration;

    work_has_started.play(); // Work starts

    if (!useSameVideo && workVideoURL) {
      loadMusic(workVideoURL, true);
      currentVideoURL = workVideoURL;
    }
  }

  updateTimerDisplay();
  startTimer(); // Automatically start next session
}

// Music Integration
function loadMusic(url, autoplay = true) {
  if (url.includes('youtube.com')) {
    // Construct the embed URL with autoplay (no mute parameter)
    const embedUrl = url.replace('watch?v=', 'embed/') + (autoplay ? '?autoplay=1' : '');
    musicPlayer.innerHTML = `
      <iframe id="videoPlayer" width="100%" height="200"
        src="${embedUrl}"
        frameborder="0" allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>`;
    
    // Explicitly trigger play using YouTube's IFrame API after a short delay
    setTimeout(() => {
      const iframe = document.getElementById('videoPlayer');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        );
      }
    }, 500); // Ensure iframe is fully loaded before triggering playback
  } else {
    console.warn('Invalid or empty YouTube URL detected. Video load skipped.');
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
    currentVideoURL = workVideoURL; // Prevent reload
  }
});

workInput.addEventListener('change', setCustomDurations);
breakInput.addEventListener('change', setCustomDurations);

// Initialize Timer Display
updateTimerDisplay();
