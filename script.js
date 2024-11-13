const display = document.getElementById("display");
const picker = document.getElementById("picker");
const count = document.getElementById("count");
const startDialog = document.getElementById("startDialog");
const scoreCard = document.getElementById("scoreCard");
const startBtn = document.getElementById("startBtn");
const soreBoardBtn = document.getElementById("soreBoardBtn");
const backBtn = document.getElementById("backBtn");

// -----------------------------------------------------

let playerName, time, totalTime, counter, selectedColor;
const ROUNDS = 5;
let colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
];

function getRandomNumber(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

//Hide the scorecard
scoreCard.classList.add("hidden");

startBtn.addEventListener("click", () => {
  playerName = document.getElementById("playerName").value;

  if (playerName == "") {
    alert("Please enter your name");
    return;
  }

  startDialog.classList.add("hidden");

  time = 0;
  counter = 0;
  totalTime = 0;

  showCountdown();
});

function showColors() {
  let uniqueColors = [];
  while (uniqueColors.length < 4) {
    let color = colors[getRandomNumber(0, colors.length)];

    if (uniqueColors.indexOf(color) == -1) {
      uniqueColors.push(color);
    }
  }
  selectedColor = uniqueColors[getRandomNumber(0, uniqueColors.length)];
  display.textContent = selectedColor;

  picker.innerHTML = "";
  uniqueColors.forEach((color) => {
    let btn = document.createElement("button");
    // btn.textContent = color;
    btn.style.backgroundColor = color;
    btn.setAttribute("data-color", color);
    btn.addEventListener("click", selectColor);
    picker.appendChild(btn);
  });
  //set timer
  time = Date.now();
  counter++;
  count.textContent = `${counter}/${ROUNDS}`;
}

function showCountdown() {
  picker.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    let btn = document.createElement("button");
    btn.style.backgroundColor = "white";
    picker.appendChild(btn);
  }

  let countDown = 3;
  let countDownInterval = setInterval(() => {
    if (countDown == 0) {
      clearInterval(countDownInterval);
      showColors();
      return;
    }
    display.textContent = countDown;
    countDown--;
  }, 1000);
}

function selectColor(e) {
  if (e.target.dataset.color === selectedColor) {
    time = Date.now() - time;
    totalTime += time;
    console.log(time);
    if (counter < ROUNDS) {
      display.textContent = time / 1000;
      showCountdown();
    } else {
      display.textContent = "";

      //Calculate score
      let avgTime = totalTime / ROUNDS;
      display.textContent = avgTime;

      let scoreList = localStorage.getItem("scoreList");
      if (scoreList == null) {
        scoreList = [];
      } else {
        scoreList = JSON.parse(scoreList);
      }

      let player = scoreList.find((p) => {
        return p.name == playerName;
      });

      console.log(player);

      if (player === undefined) {
        scoreList.push({
          name: playerName,
          score: avgTime,
        });
      } else {
        player.score = avgTime;
      }

      localStorage.setItem("scoreList", JSON.stringify(scoreList));
      showScoreBoard();
    }
  }
}

function showScoreBoard() {
  scoreCard.classList.remove("hidden");
  let scoreList = localStorage.getItem("scoreList");
  if (scoreList == null) {
    scoreList = [];
  } else {
    scoreList = JSON.parse(scoreList);
  }

  scoreList.sort((a, b) => {
    return a.score - b.score;
  });

  let scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.innerHTML = "";
  scoreList.forEach((player, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
    if (player.name == playerName) {
      tr.style.backgroundColor = "yellow";
    }
    scoreBoard.appendChild(tr);
  });
}

soreBoardBtn.onclick = showScoreBoard;
backBtn.onclick = () => {
  scoreCard.classList.add("hidden");
  startDialog.classList.remove("hidden");
};
