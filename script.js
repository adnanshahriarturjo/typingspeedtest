// Elements
const text = document.getElementById("text").innerText;
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const speedEl = document.getElementById("speed");
const accuracyEl = document.getElementById("accuracy");
const emoji = document.getElementById("emoji");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const confettiContainer = document.getElementById("confetti");

// Variables
let time = 0;
let timer = null;
let isRunning = false;

// Start button
startBtn.onclick = () => {
  if (!isRunning) {
    timer = setInterval(() => {
      time++;
      timeEl.innerText = time;
    }, 1000);
    isRunning = true;
  }
  input.focus();
};

// Pause button
pauseBtn.onclick = () => {
  clearInterval(timer);
  isRunning = false;
};

// Typing event
input.addEventListener("input", () => {
  const typed = input.value;

  let correctChars = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === text[i]) {
      correctChars++;
    }
  }

  // Accuracy
  let accuracy = typed.length === 0 ? 100 : Math.floor((correctChars / typed.length) * 100);
  accuracyEl.innerText = accuracy;

  // Speed (WPM)
  let words = typed.trim().split(" ").length;
  let speed = time > 0 ? Math.floor((words / time) * 60) : 0;
  speedEl.innerText = speed;

  // Emoji reaction
  if (accuracy > 90) {
    emoji.innerText = "😄";
  } else if (accuracy > 60) {
    emoji.innerText = "😐";
  } else {
    emoji.innerText = "😡";
  }

  // Correct / Incorrect effect
  if (typed === text.substring(0, typed.length)) {
    input.classList.add("correct");
    input.classList.remove("incorrect");
  } else {
    input.classList.add("incorrect");
    input.classList.remove("correct");
  }

  // Finish
  if (typed === text) {
    clearInterval(timer);
    isRunning = false;
    emoji.innerText = "🎉";
    launchConfetti();
  }
});

// Confetti function
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor = randomColor();

    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

// Random color
function randomColor() {
  const colors = ["red", "yellow", "blue", "green", "pink", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}