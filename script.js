const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];
let score = { R: 0, B: 0 };
const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };
lineCounter = 0;
const playersTurnText = (turn) =>
  `It's ${turn === "R" ? "Red" : "Blue"}'s turn`;
const WinerText = () => `won ${score.R > score.B ? "Red" : "Blue"}`;
const isLineSelected = (line) =>
  line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
  const gameGridContainer = document.getElementsByClassName(
    "game-grid-container"
  )[0];

  const rows = Array(N)
    .fill(0)
    .map((_, i) => i);
  const cols = Array(M)
    .fill(0)
    .map((_, i) => i);

  rows.forEach((row) => {
    cols.forEach((col) => {
      const dot = document.createElement("div");
      dot.setAttribute("class", "dot");

      const hLine = document.createElement("div");
      hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
      hLine.setAttribute("id", `h-${row}-${col}`);
      hLine.addEventListener("click", handleLineClick);

      gameGridContainer.appendChild(dot);
      if (col < M - 1) gameGridContainer.appendChild(hLine);
    });

    if (row < N - 1) {
      cols.forEach((col) => {
        const vLine = document.createElement("div");
        vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
        vLine.setAttribute("id", `v-${row}-${col}`);
        vLine.addEventListener("click", handleLineClick);

        const box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", `box-${row}-${col}`);

        gameGridContainer.appendChild(vLine);
        if (col < M - 1) gameGridContainer.appendChild(box);
      });
    }
  });

  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
  const nextTurn = turn === "R" ? "B" : "R";

  const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

  lines.forEach((l) => {
    //if line was not already selected, change it's hover color according to the next turn
    if (!isLineSelected(l)) {
      l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
    }
  });
  turn = nextTurn;
};

const isLineSelectedByRowCol = (state, i, j) => {
  if (
    (state == "h" && i >= 0 && i <= 3 && j >= 0 && j <= 2) ||
    (state == "v" && i >= 0 && i <= 2 && j >= 0 && j <= 3)
  ) {
    return isLineSelected(document.getElementById(`${state}-${i}-${j}`));
  } else return false;
};

const handleLineClick = (e) => {
  const lineId = e.target.id;
  let flag = 1; //change turn
  const selectedLine = document.getElementById(lineId);

  if (isLineSelected(selectedLine)) {
    //if line was already selected, return
    return;
  }
  lineCounter++;
  selectedLines = [...selectedLines, lineId];

  colorLine(selectedLine);
  /*************************************************** */
  let state = lineId.split("-")[0],
    i = Number(lineId.split("-")[1]),
    j = Number(lineId.split("-")[2]);

  if (state == "v") {
    if (
      isLineSelectedByRowCol("h", i, j - 1) &&
      isLineSelectedByRowCol("v", i, j - 1) &&
      isLineSelectedByRowCol("h", i + 1, j - 1)
    ) {
      document
        .getElementById(`box-${i}-${j - 1}`)
        .classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }

    if (
      isLineSelectedByRowCol("h", i, j) &&
      isLineSelectedByRowCol("v", i, j + 1) &&
      isLineSelectedByRowCol("h", i + 1, j)
    ) {
      document.getElementById(`box-${i}-${j}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
  } else if ((state = "h")) {
    if (
      isLineSelectedByRowCol("h", i - 1, j) &&
      isLineSelectedByRowCol("v", i - 1, j) &&
      isLineSelectedByRowCol("v", i - 1, j + 1)
    ) {
      document
        .getElementById(`box-${i - 1}-${j}`)
        .classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }

    if (
      isLineSelectedByRowCol("h", i + 1, j) &&
      isLineSelectedByRowCol("v", i, j) &&
      isLineSelectedByRowCol("v", i, j + 1)
    ) {
      document.getElementById(`box-${i}-${j}`).classList.add(bgClasses[turn]);
      score[turn]++;
      flag = 0;
    }
  }
  /******************************************************************* */
  if (flag === 1) changeTurn();

  if (lineCounter === 24) {
    document.getElementById("game-status").innerHTML = WinerText();
  } else {
    document.getElementById("game-status").innerHTML = playersTurnText(turn);
  }
};

const colorLine = (selectedLine) => {
  selectedLine.classList.remove(hoverClasses[turn]);
  selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();
