const dice = [
  document.querySelector('#die-1'),
  document.querySelector('#die-2'),
  document.querySelector('#die-3')
];
const rollButton = document.querySelector('#roll-button');
const clearButton = document.querySelector('#clear-button');
const totalElement = document.querySelector('#total');
const historyList = document.querySelector('#history-list');
const rollCount = document.querySelector('#roll-count');

let history = [];
let isRolling = false;

function randomDieValue() {
  return Math.floor(Math.random() * 6) + 1;
}

function updateDie(die, value) {
  die.dataset.value = value;
  die.setAttribute('aria-label', `${die.id.replace('die-', '第')}顆骰子：${value}點`);
}

function renderHistory() {
  rollCount.textContent = `${history.length} 次`;
  clearButton.disabled = history.length === 0;

  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-state">還沒有紀錄<br><span>準備好就按下擲骰</span></p>';
    return;
  }

  historyList.innerHTML = history.map((roll, index) => `
    <div class="history-item">
      <span class="history-number">${String(history.length - index).padStart(2, '0')}</span>
      <span class="history-dice">${roll.values.join('  ·  ')}</span>
      <strong class="history-total">${roll.total}</strong>
    </div>
  `).join('');
}

function rollDice() {
  if (isRolling) return;
  isRolling = true;
  rollButton.disabled = true;
  dice.forEach((die) => die.classList.add('rolling'));

  window.setTimeout(() => {
    const values = dice.map(randomDieValue);
    const total = values.reduce((sum, value) => sum + value, 0);

    dice.forEach((die, index) => updateDie(die, values[index]));
    totalElement.textContent = total;
    history.unshift({ values, total });
    renderHistory();

    dice.forEach((die) => die.classList.remove('rolling'));
    rollButton.disabled = false;
    isRolling = false;
  }, 500);
}

function clearHistory() {
  history = [];
  renderHistory();
}

rollButton.addEventListener('click', rollDice);
clearButton.addEventListener('click', clearHistory);
renderHistory();
