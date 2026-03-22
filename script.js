// Elements
let text = "";
const textElement = document.getElementById("text");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const speedEl = document.getElementById("speed");
const accuracyEl = document.getElementById("accuracy");
const emoji = document.getElementById("emoji");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const confettiContainer = document.getElementById("confetti");

// Extended random texts array
const randomTexts = [
  "The quick brown fox jumps over the lazy dog",
  "Programming is all about problem solving and creativity",
  "Every expert was once a beginner who never gave up",
  "Technology is best when it brings people together",
  "The future belongs to those who believe in the beauty of their dreams",
  "Code is poetry written for machines and humans alike",
  "Innovation distinguishes between a leader and a follower",
  "Great things never came from comfort zones",
  "Debugging is like detective work in the digital world",
  "Attention to detail is what makes the difference",
  "Typing fast is not just about speed but accuracy matters most",
  "Every keystroke brings you closer to your goal",
  "Practice makes perfect especially in typing tests",
  "The journey of a thousand miles begins with a single keystroke",
  "Your potential is limitless so keep pushing forward",
  "Success is not final and failure is not fatal",
  "Keep learning keep growing and keep improving",
  "Consistency is the key to mastery and excellence",
  "Focus on progress not perfection every single day",
  "Your dedication will always lead you to success"
];

// Variables
let time = 60;
let timer = null;
let isRunning = false;
let fullText = ""; // Continuous concatenated text
let textWords = []; // Words array
let currentTextBlock = ""; // Current text being displayed

// Function to build continuous text
function buildContinuousText(count = 3) {
  let combined = "";
  for (let i = 0; i < count; i++) {
    const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    combined += randomText + " ";
  }
  return combined.trim();
}

// Function to get random text
function getRandomText() {
  return randomTexts[Math.floor(Math.random() * randomTexts.length)];
}

// Function to update text display with colors
function updateTextDisplay(typedValue) {
  const typedWords = typedValue.trim().split(/\s+/).filter(w => w.length > 0);
  const displayWords = currentTextBlock.split(/\s+/);
  
  let coloredHtml = "";
  
  for (let i = 0; i < displayWords.length; i++) {
    const expectedWord = displayWords[i];
    const typedWord = typedWords[i] || "";
    
    if (i < typedWords.length) {
      // Word has been typed - color it
      if (typedWord === expectedWord) {
        coloredHtml += `<span style="color: green; font-weight: bold;">${expectedWord}</span> `;
      } else {
        coloredHtml += `<span style="color: red; font-weight: bold;">${expectedWord}</span> `;
      }
    } else {
      // Word not yet typed - show in gray
      coloredHtml += `<span style="color: gray;">${expectedWord}</span> `;
    }
  }
  
  textElement.innerHTML = coloredHtml.trim();
}

// Initialize text
fullText = buildContinuousText(3);
textWords = fullText.split(/\s+/).filter(w => w.length > 0);
currentTextBlock = textWords.slice(0, 15).join(" "); // First 15 words
textElement.innerText = currentTextBlock;

// Disable input initially
input.disabled = true;

// Start button
startBtn.onclick = () => {
  if (!isRunning) {
    time = 60;
    timeEl.innerText = time;
    input.value = "";
    input.disabled = false;
    input.classList.remove("correct");
    input.classList.remove("incorrect");
    emoji.innerText = "😄";
    
    // Initialize text
    fullText = buildContinuousText(3);
    textWords = fullText.split(/\s+/).filter(w => w.length > 0);
    currentTextBlock = textWords.slice(0, 15).join(" ");
    textElement.innerText = currentTextBlock;
    
    timer = setInterval(() => {
      time--;
      timeEl.innerText = time;
      
      if (time <= 0) {
        clearInterval(timer);
        isRunning = false;
        emoji.innerText = "⏹️";
        input.disabled = true;
      }
    }, 1000);
    isRunning = true;
  }
  input.focus();
};

// Restart button
restartBtn.onclick = () => {
  clearInterval(timer);
  isRunning = false;
  time = 60;
  timeEl.innerText = time;
  input.value = "";
  input.disabled = false;
  input.classList.remove("correct");
  input.classList.remove("incorrect");
  emoji.innerText = "😄";
  speedEl.innerText = "0";
  accuracyEl.innerText = "100";
  
  // Get new random texts
  fullText = buildContinuousText(3);
  textWords = fullText.split(/\s+/).filter(w => w.length > 0);
  currentTextBlock = textWords.slice(0, 15).join(" ");
  textElement.innerText = currentTextBlock;
  
  input.focus();
};

// Typing event
input.addEventListener("input", () => {
  if (!isRunning) return;
  
  const typedValue = input.value;
  const typedWords = typedValue.trim().split(/\s+/).filter(w => w.length > 0);
  const displayWords = currentTextBlock.split(/\s+/);
  
  // Update colored text display
  updateTextDisplay(typedValue);
  
  // Check if current block is completed
  if (typedWords.length > 0 && typedWords[typedWords.length - 1] === displayWords[displayWords.length - 1] && 
      typedValue.trim().endsWith(currentTextBlock)) {
    
    // Find next block of 15 words
    const lastSuccessfulWord = currentTextBlock.split(/\s+/).length - 1;
    let currentIndex = 0;
    fullText.split(/\s+/).forEach((word, idx) => {
      if (word === displayWords[displayWords.length - 1] && idx > currentIndex) {
        currentIndex = idx;
      }
    });
    
    // Load next block if available
    const nextIndex = currentIndex + 1;
    if (nextIndex < textWords.length) {
      const endIndex = Math.min(nextIndex + 15, textWords.length);
      currentTextBlock = textWords.slice(nextIndex, endIndex).join(" ");
      input.value = "";
    } else if (nextIndex >= textWords.length) {
      // Load more text if running out
      fullText = fullText + " " + buildContinuousText(3);
      textWords = fullText.split(/\s+/).filter(w => w.length > 0);
      const endIndex = Math.min(nextIndex + 15, textWords.length);
      currentTextBlock = textWords.slice(nextIndex, endIndex).join(" ");
      input.value = "";
    }
  }
  
  // Calculate accuracy and speed based on total typed
  let correctWords = 0;
  let totalWords = typedWords.length;
  
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === textWords[i]) {
      correctWords++;
    }
  }
  
  // Accuracy
  let accuracy = totalWords === 0 ? 100 : Math.floor((correctWords / totalWords) * 100);
  accuracyEl.innerText = accuracy;
  
  // Speed (WPM)
  let elapsedTime = 60 - time;
  if (elapsedTime > 0) {
    let speed = Math.floor((totalWords / elapsedTime) * 60);
    speedEl.innerText = speed;
  }
  
  // Emoji reaction
  if (accuracy > 90) {
    emoji.innerText = "😄";
  } else if (accuracy > 60) {
    emoji.innerText = "😐";
  } else {
    emoji.innerText = "😡";
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