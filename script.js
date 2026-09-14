const diceStage = document.querySelector("#dice-stage");
const diceNumber = document.querySelector("#dice-number");
const rollButton = document.querySelector("#roll-button");
const decreaseDice = document.querySelector("#decrease-dice");
const increaseDice = document.querySelector("#increase-dice");
const rollCount = document.querySelector("#roll-count");
const totalValue = document.querySelector("#total-value");
const averageValue = document.querySelector("#average-value");
const highestValue = document.querySelector("#highest-value");
const historyList = document.querySelector("#history-list");
const clearHistory = document.querySelector("#clear-history");

let diceCount = 2;
let rolls = [];
let isRolling = false;

const pipPositions = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function createDie(value, extraClass = "") {
  const die = document.createElement("div");
  die.className = `die ${extraClass}`;
  die.setAttribute("aria-label", `${value} 點`);
  pipPositions[value].forEach((position) => {
    const pip = document.createElement("span");
    pip.className = "pip";
    pip.style.gridArea = `${Math.floor(position / 3) + 1} / ${(position % 3) + 1}`;
    die.appendChild(pip);
  });
  return die;
}

function renderDice(values, animate = false) {
  diceStage.replaceChildren();
  values.forEach((value) => diceStage.appendChild(createDie(value, animate ? "rolling" : "")));
}

function updateStats(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  totalValue.textContent = total;
  averageValue.textContent = (total / values.length).toFixed(1);
  highestValue.textContent = Math.max(...values);
}

function renderHistory() {
  if (rolls.length === 0) {
    historyList.innerHTML = '<p class="empty-state">開始擲骰後，結果會出現在這裡。</p>';
    return;
  }

  historyList.replaceChildren(...rolls.map((values) => {
    const entry = document.createElement("div");
    entry.className = "history-entry";
    const dice = document.createElement("div");
    dice.className = "history-dice";
    values.forEach((value) => {
      const die = document.createElement("span");
      die.className = "history-die";
      die.textContent = value;
      dice.appendChild(die);
    });
    const total = document.createElement("span");
    total.className = "history-total";
    total.textContent = `總和 ${values.reduce((sum, value) => sum + value, 0)}`;
    entry.append(dice, total);
    return entry;
  }));
}

function setDiceCount(nextCount) {
  diceCount = Math.max(1, Math.min(6, nextCount));
  diceNumber.textContent = diceCount;
}

function rollDice() {
  if (isRolling) return;
  isRolling = true;
  const values = Array.from({ length: diceCount }, randomDie);
  renderDice(values, true);
  rollButton.disabled = true;

  window.setTimeout(() => {
    renderDice(values);
    updateStats(values);
    rolls.unshift(values);
    rolls = rolls.slice(0, 5);
    rollCount.textContent = rolls.length;
    renderHistory();
    isRolling = false;
    rollButton.disabled = false;
  }, 550);
}

decreaseDice.addEventListener("click", () => setDiceCount(diceCount - 1));
increaseDice.addEventListener("click", () => setDiceCount(diceCount + 1));
rollButton.addEventListener("click", rollDice);
clearHistory.addEventListener("click", () => {
  rolls = [];
  rollCount.textContent = "0";
  renderHistory();
});

setDiceCount(diceCount);