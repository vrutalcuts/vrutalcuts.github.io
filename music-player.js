const currentTimeElement = document.querySelector("[data-current-time]");
const durationElement = document.querySelector("[data-duration]");
const progressBar = document.querySelector("[data-progress-bar]");
const playToggle = document.querySelector("[data-play-toggle]");
const soundToggle = document.querySelector("[data-sound-toggle]");
const audio = document.querySelector("#track-audio");

audio.volume = 0.55;
audio.currentTime = 0;
audio.muted = true;

let isPlaying = false;

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function renderPlayer() {
  const duration = audio.duration || 197;
  const progress = duration ? (audio.currentTime / duration) * 100 : 0;

  currentTimeElement.textContent = formatTime(audio.currentTime);
  durationElement.textContent = formatTime(duration);
  progressBar.style.width = `${progress}%`;
  playToggle.classList.toggle("is-playing", isPlaying);
  playToggle.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  soundToggle.classList.toggle("is-playing", !audio.muted);
  soundToggle.setAttribute("aria-label", audio.muted ? "Unmute sound" : "Mute sound");
}

async function playAudio() {
  try {
    await audio.play();
    isPlaying = true;
  } catch (error) {
    isPlaying = false;
  }

  renderPlayer();
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  renderPlayer();
}

playToggle.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

soundToggle.addEventListener("click", () => {
  audio.muted = !audio.muted;

  if (audio.paused) {
    playAudio();
  }

  renderPlayer();
});

document.addEventListener(
  "pointerdown",
  () => {
    if (audio.paused) {
      playAudio();
    }
  },
  { once: true },
);

audio.addEventListener("loadedmetadata", renderPlayer);
audio.addEventListener("timeupdate", renderPlayer);
audio.addEventListener("play", () => {
  isPlaying = true;
  renderPlayer();
});
audio.addEventListener("pause", () => {
  isPlaying = false;
  renderPlayer();
});
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  playAudio();
});

renderPlayer();
playAudio();
