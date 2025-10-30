const choices = ["stone", "paper", "scissor"];
const images = {
  stone: "stone.png",
  paper: "paper.png",
  scissor: "scissor.png"
};

const playerCard = document.getElementById("playerCard");
const computerCard = document.getElementById("computerCard");
const playerDots = document.getElementById("playerDots");
const computerDots = document.getElementById("computerDots");
const popup = document.getElementById("popup");
const resultText = document.getElementById("resultText");
const nextBtn = document.getElementById("nextBtn");
const choiceEls = document.querySelectorAll(".choice");

let round = 0;
let locked = false; 

choiceEls.forEach(el => {
  el.addEventListener("click", () => {
    if (locked) return;
    if (round >= 3) return;
    const playerChoice = el.dataset.choice;
    runRound(playerChoice);
  });
});

function runRound(playerChoice) {
  locked = true;
  round++;

  const computerChoice = choices[Math.floor(Math.random() * choices.length)];

  // Show Player card
  playerCard.classList.remove("placeholder");
  playerCard.innerHTML = `<img src="${images[playerChoice]}" class="fly">`;

  // Show computer hidden back first
  computerCard.classList.remove("placeholder");
  computerCard.innerHTML = `<img src="back.png" class="computer-back">`;

  // Reveal after delay
  setTimeout(() => {
    computerCard.innerHTML = `<img src="${images[computerChoice]}" class="flip">`;

    setTimeout(() => {
      const winner = decideWinner(playerChoice, computerChoice);

      playBattleAnimation(winner);
      updateHistoryDots(winner);

      setTimeout(() => {
        showRoundPopup(winner);
      }, 550);

    }, 650);

  }, 550);
}

function decideWinner(p, c) {
  if (p === c) return "draw";
  if (
    (p === "stone" && c === "scissor") ||
    (p === "paper" && c === "stone") ||
    (p === "scissor" && c === "paper")
  ) return "player";
  return "computer";
}

function playBattleAnimation(winner) {
  const pImg = playerCard.querySelector("img");
  const cImg = computerCard.querySelector("img");

  if (winner === "player") {
    cImg.classList.add("shake");
    setTimeout(() => cImg.classList.add("fade"), 420);
  } else if (winner === "computer") {
    pImg.classList.add("shake");
    setTimeout(() => pImg.classList.add("fade"), 420);
  } else {
    // Tie → both shake only (no fade)
    pImg.classList.add("shake");
    cImg.classList.add("shake");
    setTimeout(() => {
      pImg.classList.remove("shake");
      cImg.classList.remove("shake");
    }, 600);
  }
}

function updateHistoryDots(winner) {
  const pDot = document.createElement("div");
  pDot.className = "dot";
  const cDot = document.createElement("div");
  cDot.className = "dot";

  if (winner === "player") {
    pDot.style.background = "green";
    cDot.style.background = "red";
  } else if (winner === "computer") {
    pDot.style.background = "red";
    cDot.style.background = "green";
  } else {
    pDot.style.background = "gray";
    cDot.style.background = "gray";
  }

  playerDots.appendChild(pDot);
  computerDots.appendChild(cDot);
}

function showRoundPopup(winner) {
  if (winner === "player") resultText.innerText = "✅ You Win This Round!";
  else if (winner === "computer") resultText.innerText = "❌ Computer Wins This Round!";
  else resultText.innerText = "🤝 This Round is a Tie!";

  popup.style.display = "flex";
}

nextBtn.addEventListener("click", () => {
  popup.style.display = "none";

  if (round >= 3) {
    showFinalResult();
    return;
  }

  resetArena();
  locked = false;
});

function showFinalResult() {
  const pWins = Array.from(playerDots.children).filter(d => d.style.background === "green").length;
  const cWins = Array.from(computerDots.children).filter(d => d.style.background === "green").length;

  if (pWins > cWins) resultText.innerText = "🎉 You Win The Game!";
  else if (cWins > pWins) resultText.innerText = "😢 Computer Wins The Game!";
  else resultText.innerText = "🤝 The Game is a Tie!";

  popup.style.display = "flex";

  nextBtn.onclick = () => {
    location.reload();
  };
}

function resetArena() {
  playerCard.classList.add("placeholder");
  computerCard.classList.add("placeholder");
  playerCard.innerHTML = "PLAYER";
  computerCard.innerHTML = "COMPUTER";
}
