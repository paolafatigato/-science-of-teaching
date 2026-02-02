const slides = Array.from(document.querySelectorAll(".slide"));
const navInfo = document.getElementById("navInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const progressDots = document.getElementById("progressDots");
const progress = document.getElementById("progress");
const menuBtn = document.getElementById("menuBtn");
const slideMenu = document.getElementById("slideMenu");
const menuList = document.getElementById("menuList");
const closeMenu = document.getElementById("closeMenu");

let currentSlide = 0;

function updateNav() {
  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === currentSlide);
  });

  navInfo.textContent = `${currentSlide + 1} / ${slides.length}`;
  const progressPercent = ((currentSlide + 1) / slides.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  highlightDot();
}

function highlightDot() {
  const dots = progressDots.querySelectorAll("span");
  dots.forEach((dot, idx) => {
    dot.style.background = idx === currentSlide ? "white" : "rgba(255,255,255,0.35)";
  });
}

function goToSlide(idx) {
  currentSlide = Math.max(0, Math.min(slides.length - 1, idx));
  updateNav();
  handleSlideActivation();
}

prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goToSlide(currentSlide + 1);
  if (event.key === "ArrowLeft") goToSlide(currentSlide - 1);
});

progressDots.innerHTML = slides.map(() => "<span></span>").join("");

progress.addEventListener("click", (event) => {
  const rect = progress.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  const target = Math.round(ratio * (slides.length - 1));
  goToSlide(target);
});

menuBtn.addEventListener("click", () => {
  slideMenu.classList.add("open");
  slideMenu.setAttribute("aria-hidden", "false");
});

closeMenu.addEventListener("click", () => {
  slideMenu.classList.remove("open");
  slideMenu.setAttribute("aria-hidden", "true");
});

menuList.innerHTML = slides
  .map((slide, index) => {
    const title = slide.dataset.title;
    const section = slide.dataset.section;
    return `<div class="menu-item" data-index="${index}">${section} • ${title}</div>`;
  })
  .join("");

menuList.addEventListener("click", (event) => {
  const item = event.target.closest(".menu-item");
  if (!item) return;
  goToSlide(parseInt(item.dataset.index, 10));
  slideMenu.classList.remove("open");
});

// Slide 1.1 counter + reveal
const neuronCounter = document.getElementById("neuronCounter");
const revealNeuron = document.getElementById("revealNeuron");
const startBtn = document.getElementById("startBtn");

let counterInterval;
function startCounter() {
  clearInterval(counterInterval);
  let value = 0;
  const target = 86000000000;
  const step = target / 120;
  counterInterval = setInterval(() => {
    value += step;
    if (value >= target) {
      value = target;
      clearInterval(counterInterval);
    }
    neuronCounter.textContent = Math.floor(value).toLocaleString("en-US");
  }, 20);
}

revealNeuron.addEventListener("click", () => {
  revealNeuron.textContent = "neurons";
});

startBtn.addEventListener("click", () => goToSlide(1));

// Slide 2.1 neuron toggle + synapse
const strengthenBtn = document.getElementById("strengthenBtn");
const synapse = document.getElementById("synapse");
const pathLine = document.getElementById("pathLine");
const neuronDemo = document.getElementById("neuronDemo");
const neuronNodes = neuronDemo ? Array.from(neuronDemo.querySelectorAll(".neuron")) : [];

function setNeuronActive(neuron, isActive) {
  neuron.classList.toggle("active", isActive);
  neuron.setAttribute("aria-pressed", String(isActive));
}

function updateSynapseState() {
  const bothActive = neuronNodes.length === 2 && neuronNodes.every((node) => node.classList.contains("active"));
  synapse.classList.toggle("strong", bothActive);
}

neuronNodes.forEach((neuron) => {
  neuron.addEventListener("click", () => {
    const nextState = !neuron.classList.contains("active");
    setNeuronActive(neuron, nextState);
    updateSynapseState();
  });

  neuron.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const nextState = !neuron.classList.contains("active");
    setNeuronActive(neuron, nextState);
    updateSynapseState();
  });
});

strengthenBtn.addEventListener("click", () => {
  const shouldActivateAll = neuronNodes.some((node) => !node.classList.contains("active"));
  neuronNodes.forEach((node) => setNeuronActive(node, shouldActivateAll));
  updateSynapseState();
  pathLine.classList.toggle("strong", shouldActivateAll);
});

// Slide 2.2 writing demo
const writingCanvas = document.getElementById("writingCanvas");
const playWriting = document.getElementById("playWriting");
const resetWriting = document.getElementById("resetWriting");
const wctx = writingCanvas.getContext("2d");

function drawLine(progress = 0, shake = 1) {
  wctx.clearRect(0, 0, writingCanvas.width, writingCanvas.height);
  wctx.lineWidth = 4;
  wctx.strokeStyle = "#53d8fb";
  wctx.beginPath();
  const startX = 40;
  const endX = writingCanvas.width - 40;
  const y = writingCanvas.height / 2;
  for (let x = startX; x <= endX * progress; x += 8) {
    const jitter = (Math.random() - 0.5) * 20 * shake;
    wctx.lineTo(x, y + jitter);
  }
  wctx.stroke();
}

let writingFrame;
function animateWriting() {
  let t = 0;
  function step() {
    t += 0.01;
    const shake = Math.max(0, 1 - t * 1.2);
    drawLine(Math.min(1, t), shake);
    if (t < 1.2) {
      writingFrame = requestAnimationFrame(step);
    }
  }
  cancelAnimationFrame(writingFrame);
  step();
}

playWriting.addEventListener("click", animateWriting);
resetWriting.addEventListener("click", () => drawLine(0, 1));

// Slide 3.1.2 letter test
const letterDisplay = document.getElementById("letterDisplay");
const startRandomLetters = document.getElementById("startRandomLetters");
const reviewRandomLetters = document.getElementById("reviewRandomLetters");
const startSentenceLetters = document.getElementById("startSentenceLetters");
const resetLetters = document.getElementById("resetLetters");
const letterTimer = document.getElementById("letterTimer");
const letterTimerValue = document.getElementById("letterTimerValue");

const sentence = "the quick brown fox jumps over the lazy dog";
const letters = sentence.replace(/\s/g, "").split("");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

let letterTimerInterval;
let letterTimerTimeout;
let lastRandomLetters = [];

function updateLetterTimer(value, total) {
  const clamped = Math.max(0, value);
  const progress = ((total - clamped) / total) * 360;
  letterTimerValue.textContent = clamped;
  letterTimer.style.background = `conic-gradient(var(--accent) ${progress}deg, rgba(255, 255, 255, 0.12) ${progress}deg)`;
}

function startLetterTimer(durationSeconds = 11) {
  clearInterval(letterTimerInterval);
  clearTimeout(letterTimerTimeout);
  letterTimer.classList.add("active", "pulse");
  let remaining = durationSeconds;
  updateLetterTimer(remaining, durationSeconds);
  letterTimerInterval = setInterval(() => {
    remaining -= 1;
    updateLetterTimer(remaining, durationSeconds);
    if (remaining <= 0) {
      clearInterval(letterTimerInterval);
      letterTimer.classList.remove("pulse");
    }
  }, 1000);
  letterTimerTimeout = setTimeout(() => {
    letterTimer.classList.remove("active", "pulse");
  }, durationSeconds * 1000 + 600);
}

function showLetters(list, options = {}) {
  clearTimeout(letterTimerTimeout);
  letterDisplay.textContent = options.useSentence ? sentence : list.join(" ");
  letterDisplay.classList.add("active");
  letterDisplay.classList.remove("times-up");
  startLetterTimer(11);
  setTimeout(() => {
    letterDisplay.textContent = "Time's up! How many did you remember?";
    letterDisplay.classList.remove("active");
    letterDisplay.classList.remove("random");
    letterDisplay.classList.add("times-up");
  }, 11000);
}

startRandomLetters.addEventListener("click", () => {
  lastRandomLetters = shuffle([...letters]);
  letterDisplay.classList.add("random");
  showLetters(lastRandomLetters);
});

startSentenceLetters.addEventListener("click", () => {
  letterDisplay.classList.add("random");
  showLetters([...letters], { useSentence: true });
});

reviewRandomLetters.addEventListener("click", () => {
  if (!lastRandomLetters.length) {
    letterDisplay.textContent = "Start random letters first.";
    letterDisplay.classList.remove("active");
    return;
  }
  clearInterval(letterTimerInterval);
  clearTimeout(letterTimerTimeout);
  letterDisplay.textContent = lastRandomLetters.join(" ");
  letterDisplay.classList.add("random");
  letterDisplay.classList.remove("active");
  letterDisplay.classList.remove("times-up");
  if (letterTimer) {
    letterTimer.classList.remove("active", "pulse");
    letterTimerValue.textContent = "11";
    letterTimer.style.background = "conic-gradient(var(--accent) 0deg, rgba(255, 255, 255, 0.12) 0deg)";
  }
});

resetLetters.addEventListener("click", () => {
  letterDisplay.textContent = "Ready?";
  letterDisplay.classList.remove("active");
  letterDisplay.classList.remove("random");
  letterDisplay.classList.remove("times-up");
  clearInterval(letterTimerInterval);
  clearTimeout(letterTimerTimeout);
  if (letterTimer) {
    letterTimer.classList.remove("active", "pulse");
    letterTimerValue.textContent = "11";
    letterTimer.style.background = "conic-gradient(var(--accent) 0deg, rgba(255, 255, 255, 0.12) 0deg)";
  }
});

// Slide 3.2 magic number quiz
const magicInput = document.getElementById("magicInput");
const magicCheck = document.getElementById("magicCheck");
const magicFeedback = document.getElementById("magicFeedback");
const magicReveal = document.getElementById("magicReveal");
const brain = document.getElementById("brain");

magicCheck.addEventListener("click", () => {
  const value = parseInt(magicInput.value, 10);
  if (!value) {
    magicFeedback.textContent = "Type a number first!";
    return;
  }

  brain.classList.remove("celebrate");

  if (value >= 4 && value <= 7) {
    magicFeedback.textContent = "Correct!";
    magicReveal.hidden = false;
    brain.classList.add("celebrate");
  } else if (value <= 3) {
    magicFeedback.textContent = "More than that!";
  } else if (value >= 10) {
    magicFeedback.textContent = "That would be amazing, but no...";
  } else {
    magicFeedback.textContent = "Very close!";
  }
});

// Slide 3.3 Chunk Builder game
const verbs = [
  "make",
  "take",
  "do",
  "have",
  "surf",
  "catch",
  "pay",
  "break",
];

const phrases = [
  "a mistake",
  "a photo",
  "homework",
  "breakfast",
  "the internet",
  "a cold",
  "attention",
  "the rules",
];

const verbsContainer = document.getElementById("verbs");
const phrasesContainer = document.getElementById("phrases");
const scoreEl = document.getElementById("score");
const chunkFeedback = document.getElementById("chunkFeedback");

const pairs = {
  make: "a mistake",
  take: "a photo",
  do: "homework",
  have: "breakfast",
  surf: "the internet",
  catch: "a cold",
  pay: "attention",
  break: "the rules",
};

let score = 0;

function shuffleCopy(list) {
  return shuffle([...list]);
}

function buildNonMatchingPhrases(verbOrder, phraseList) {
  let attempt = 0;
  let shuffled = shuffleCopy(phraseList);
  while (attempt < 20 && shuffled.some((phrase, idx) => pairs[verbOrder[idx]] === phrase)) {
    shuffled = shuffleCopy(phraseList);
    attempt += 1;
  }

  if (shuffled.some((phrase, idx) => pairs[verbOrder[idx]] === phrase)) {
    for (let shift = 1; shift < phraseList.length; shift += 1) {
      const rotated = [...shuffled.slice(shift), ...shuffled.slice(0, shift)];
      if (!rotated.some((phrase, idx) => pairs[verbOrder[idx]] === phrase)) {
        shuffled = rotated;
        break;
      }
    }
  }

  return shuffled;
}

function renderGame() {
  verbsContainer.innerHTML = "";
  phrasesContainer.innerHTML = "";
  const shuffledVerbs = shuffleCopy(verbs);
  const shuffledPhrases = buildNonMatchingPhrases(shuffledVerbs, phrases);

  shuffledVerbs.forEach((verb) => {
    const div = document.createElement("div");
    div.className = "word";
    div.textContent = verb;
    div.draggable = true;
    div.dataset.value = verb;
    verbsContainer.appendChild(div);
  });

  shuffledPhrases.forEach((phrase) => {
    const target = document.createElement("div");
    target.className = "target";
    target.dataset.value = phrase;
    target.innerHTML = `<strong>${phrase}</strong>`;
    phrasesContainer.appendChild(target);
  });
}

verbsContainer.addEventListener("dragstart", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  event.dataTransfer.setData("text/plain", event.target.dataset.value);
});

phrasesContainer.addEventListener("dragover", (event) => {
  event.preventDefault();
});

phrasesContainer.addEventListener("drop", (event) => {
  event.preventDefault();
  const verb = event.dataTransfer.getData("text/plain");
  const target = event.target.closest(".target");
  if (!target || target.classList.contains("correct")) return;
  const phrase = target.dataset.value;
  if (pairs[verb] === phrase) {
    target.classList.add("correct");
    target.innerHTML = `<strong>${verb} ${phrase}</strong>`;
    score += 1;
    scoreEl.textContent = score;
    chunkFeedback.textContent = "Great match!";
    if (score === 8) {
      chunkFeedback.textContent = "Now these are CHUNKS in your brain - easier to remember than separate words!";
    }
  } else {
    chunkFeedback.textContent = "Try again!";
  }
});

// Slide 4.1 hippocampus matchup
const hippoMatchup = document.getElementById("hippocampusMatchup");
const hippoFeedback = document.getElementById("hippoFeedback");
const hippoReveal = document.getElementById("hippoReveal");
const hippoCards = hippoMatchup ? Array.from(hippoMatchup.querySelectorAll(".contender-card")) : [];
const hippoWinner = hippoMatchup ? hippoMatchup.querySelector(".contender-card[data-correct='true']") : null;

function resetHippocampusMatchup() {
  if (!hippoMatchup) return;
  hippoMatchup.dataset.revealed = "false";
  hippoMatchup.classList.remove("revealed");
  hippoCards.forEach((card) => {
    card.disabled = false;
    card.classList.remove("picked", "winner", "loser");
  });
  if (hippoReveal) hippoReveal.hidden = true;
  if (hippoFeedback) hippoFeedback.textContent = "Click a contender to vote.";
}

if (hippoMatchup) {
  hippoMatchup.addEventListener("click", (event) => {
    const card = event.target.closest(".contender-card");
    if (!card || hippoMatchup.dataset.revealed === "true") return;

    hippoMatchup.dataset.revealed = "true";
    hippoMatchup.classList.add("revealed");

    hippoCards.forEach((btn) => {
      btn.disabled = true;
      btn.classList.toggle("picked", btn === card);
    });

    if (hippoWinner) {
      hippoWinner.classList.add("winner");
      hippoCards.filter((btn) => btn !== hippoWinner).forEach((btn) => btn.classList.add("loser"));
    }

    if (hippoFeedback) {
      hippoFeedback.textContent = card.dataset.choice === "professor"
        ? "Most students pick the professor... but watch the reveal!"
        : "Great guess! Watch the reveal.";
    }

    if (hippoReveal) hippoReveal.hidden = false;
  });
}

// Slide 4.1 forgetting curve (removed from deck, keep safe guards)
const forgettingCanvas = document.getElementById("forgettingCanvas");
const fctx = forgettingCanvas ? forgettingCanvas.getContext("2d") : null;

function drawAxes(ctx, width, height) {
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 20);
  ctx.lineTo(60, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "16px Segoe UI";
  ctx.fillText("Memory", 10, 30);
  ctx.fillText("Time", width - 70, height - 10);
}

function drawForgettingCurve() {
  if (!forgettingCanvas || !fctx) return;
  fctx.clearRect(0, 0, forgettingCanvas.width, forgettingCanvas.height);
  drawAxes(fctx, forgettingCanvas.width, forgettingCanvas.height);
  fctx.strokeStyle = "#ff6b6b";
  fctx.lineWidth = 4;
  fctx.beginPath();
  for (let x = 0; x <= 1; x += 0.02) {
    const y = Math.exp(-4 * x);
    const px = 60 + x * (forgettingCanvas.width - 100);
    const py = (forgettingCanvas.height - 40) - y * (forgettingCanvas.height - 80);
    if (x === 0) fctx.moveTo(px, py);
    else fctx.lineTo(px, py);
  }
  fctx.stroke();
}

// Slide 4.2 spaced repetition
const spacedCanvas = document.getElementById("spacedCanvas");
const sctx = spacedCanvas ? spacedCanvas.getContext("2d") : null;

function drawSpacedCurve() {
  if (!spacedCanvas || !sctx) return;
  sctx.clearRect(0, 0, spacedCanvas.width, spacedCanvas.height);
  drawAxes(sctx, spacedCanvas.width, spacedCanvas.height);
  sctx.strokeStyle = "#53d8fb";
  sctx.lineWidth = 4;
  sctx.beginPath();
  let lastY = 1;
  for (let x = 0; x <= 1; x += 0.02) {
    let y = Math.exp(-3 * x);
    if (x > 0.25 && x < 0.27) y = Math.min(1, lastY + 0.3);
    if (x > 0.5 && x < 0.52) y = Math.min(1, lastY + 0.2);
    if (x > 0.75 && x < 0.77) y = Math.min(1, lastY + 0.15);
    const px = 60 + x * (spacedCanvas.width - 100);
    const py = (spacedCanvas.height - 40) - y * (spacedCanvas.height - 80);
    if (x === 0) sctx.moveTo(px, py);
    else sctx.lineTo(px, py);
    lastY = y;
  }
  sctx.stroke();

  sctx.fillStyle = "#46f4b3";
  [0.25, 0.5, 0.75].forEach((mark) => {
    const px = 60 + mark * (spacedCanvas.width - 100);
    const py = (spacedCanvas.height - 40) - Math.exp(-3 * mark) * (spacedCanvas.height - 80);
    sctx.beginPath();
    sctx.arc(px, py, 6, 0, Math.PI * 2);
    sctx.fill();
  });
}

// Slide 4.3 memory experiment
const flashWord = document.getElementById("flashWord");
const startFlash = document.getElementById("startFlash");
const recallInput = document.getElementById("recallInput");
const checkRecall = document.getElementById("checkRecall");
const recallFeedback = document.getElementById("recallFeedback");

const wordList = ["apple", "river", "chair", "school", "music", "flower", "happy", "train", "planet", "window"];
let flashIndex = 0;
let flashTimer;

function startFlashing() {
  recallFeedback.textContent = "";
  recallInput.value = "";
  flashIndex = 0;
  clearInterval(flashTimer);
  flashWord.textContent = wordList[flashIndex];
  flashTimer = setInterval(() => {
    flashIndex += 1;
    if (flashIndex >= wordList.length) {
      clearInterval(flashTimer);
      flashWord.textContent = "Type the words you remember";
      return;
    }
    flashWord.textContent = wordList[flashIndex];
  }, 1000);
}

startFlash.addEventListener("click", startFlashing);

checkRecall.addEventListener("click", () => {
  const typed = recallInput.value
    .toLowerCase()
    .split(/\s|,|;/)
    .filter((w) => w);
  const unique = new Set(typed);
  let count = 0;
  unique.forEach((word) => {
    if (wordList.includes(word)) count += 1;
  });
  recallFeedback.textContent = `You remembered ${count} / 10 words. This is normal! Your working memory has limits.`;
});

// Slide 4.4 fading game
const fadeGame = document.getElementById("fadeGame");
const startFade = document.getElementById("startFade");
const gameTime = document.getElementById("gameTime");
const fadeFeedback = document.getElementById("fadeFeedback");

const fadeItems = [
  { word: "cat", img: "🐱" },
  { word: "book", img: "📘" },
  { word: "sun", img: "☀️" },
  { word: "tree", img: "🌳" },
  { word: "fish", img: "🐟" },
];

let gameInterval;
let fadeInterval;
let timeLeft = 60;

function renderFadeGame() {
  fadeGame.innerHTML = "";
  fadeItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "fade-item";
    div.dataset.index = index;
    div.innerHTML = `${item.img} ${item.word}`;
    div.style.opacity = "1";
    fadeGame.appendChild(div);
  });
}

function startFadeGame() {
  renderFadeGame();
  fadeFeedback.textContent = "";
  timeLeft = 60;
  gameTime.textContent = timeLeft;
  clearInterval(gameInterval);
  clearInterval(fadeInterval);

  gameInterval = setInterval(() => {
    timeLeft -= 1;
    gameTime.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(fadeInterval);
      fadeFeedback.textContent = "Great job! You beat the forgetting curve.";
    }
  }, 1000);

  fadeInterval = setInterval(() => {
    fadeGame.querySelectorAll(".fade-item").forEach((item) => {
      const current = parseFloat(item.style.opacity);
      const next = Math.max(0, current - 0.05);
      item.style.opacity = next.toString();
    });
  }, 600);
}

fadeGame.addEventListener("click", (event) => {
  const item = event.target.closest(".fade-item");
  if (!item) return;
  const opacity = parseFloat(item.style.opacity);
  const boost = Math.min(1, opacity + 0.3);
  item.style.opacity = boost.toString();
});

startFade.addEventListener("click", startFadeGame);

// Slide 5.2 swimming analogy
const swimOptions = document.getElementById("swimOptions");
const swimFeedback = document.getElementById("swimFeedback");
const swimLearning = document.getElementById("swimLearning");

if (swimOptions) {
  swimOptions.addEventListener("click", (event) => {
    const btn = event.target.closest(".option-card");
    if (!btn) return;
    swimOptions.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("selected", "correct", "wrong");
    });
    const isCorrect = btn.dataset.correct === "true";
    btn.classList.add("selected", isCorrect ? "correct" : "wrong");
    if (swimFeedback) {
      swimFeedback.textContent = isCorrect
        ? "Yes! You learn by doing."
        : "Not quite. Real learning comes from practice.";
    }
    if (swimLearning) {
      swimLearning.hidden = !isCorrect;
      if (isCorrect) swimLearning.classList.add("show");
    }
  });
}

// Slide 5.3 active/passive quiz
const apQuiz = document.getElementById("apQuiz");
const apScore = document.getElementById("apScore");
const apTotal = document.getElementById("apTotal");
const apFeedback = document.getElementById("apFeedback");

let apScoreValue = 0;
let apAnswered = 0;
const apItems = apQuiz ? Array.from(apQuiz.querySelectorAll(".ap-item")) : [];

if (apTotal) {
  apTotal.textContent = String(apItems.length);
}

if (apQuiz) {
  apQuiz.addEventListener("click", (event) => {
    const btn = event.target.closest(".ap-btn");
    if (!btn) return;
    const item = btn.closest(".ap-item");
    if (!item || item.dataset.answered === "true") return;

    const choice = btn.dataset.choice;
    const answer = item.dataset.answer;
    const isCorrect = choice === answer;
    item.dataset.answered = "true";
    item.classList.add(isCorrect ? "correct" : "wrong", "flash");

    item.querySelectorAll(".ap-btn").forEach((button) => {
      button.disabled = true;
    });

    if (isCorrect) {
      apScoreValue += 1;
      if (apScore) apScore.textContent = String(apScoreValue);
    }

    apAnswered += 1;
    if (apFeedback) {
      apFeedback.textContent = isCorrect ? "Correct!" : "Not quite.";
      if (apAnswered === apItems.length) {
        apFeedback.textContent = `Done! Your score: ${apScoreValue} / ${apItems.length}.`;
      }
    }

    setTimeout(() => item.classList.remove("flash"), 500);
  });
}

function handleSlideActivation() {
  if (currentSlide === 0) startCounter();
  if (currentSlide === 8) resetHippocampusMatchup();
  if (currentSlide === 9) drawSpacedCurve();
}

renderGame();
updateNav();
handleSlideActivation();
