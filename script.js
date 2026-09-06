const result = document.querySelector('#result');
const expression = document.querySelector('#expression');
const keys = document.querySelector('.keypad');

let currentValue = '0';
let storedValue = null;
let pendingOperator = null;
let shouldReset = false;

const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

function formatValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Error';
  return number.toLocaleString('en-US', { maximumFractionDigits: 10, useGrouping: false });
}

function updateDisplay() {
  result.textContent = formatValue(currentValue);
  expression.textContent = storedValue !== null && pendingOperator
    ? `${formatValue(storedValue)} ${symbols[pendingOperator]}`
    : 'Ready';
}

function inputNumber(number) {
  if (currentValue === 'Error' || shouldReset) {
    currentValue = number;
    shouldReset = false;
  } else {
    currentValue = currentValue === '0' ? number : currentValue + number;
  }
  updateDisplay();
}

function inputDecimal() {
  if (currentValue === 'Error' || shouldReset) {
    currentValue = '0.';
    shouldReset = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function calculate(first, second, operator) {
  const a = Number(first);
  const b = Number(second);
  if (operator === 'add') return a + b;
  if (operator === 'subtract') return a - b;
  if (operator === 'multiply') return a * b;
  if (operator === 'divide') return b === 0 ? Infinity : a / b;
  return b;
}

function chooseOperator(operator) {
  if (currentValue === 'Error') return;
  if (pendingOperator && storedValue !== null && !shouldReset) {
    const calculated = calculate(storedValue, currentValue, pendingOperator);
    storedValue = calculated;
    currentValue = String(calculated);
  } else {
    storedValue = Number(currentValue);
  }
  pendingOperator = operator;
  shouldReset = true;
  updateDisplay();
}

function equals() {
  if (pendingOperator === null || storedValue === null || currentValue === 'Error') return;
  const first = storedValue;
  const second = shouldReset ? storedValue : Number(currentValue);
  const answer = calculate(first, second, pendingOperator);
  expression.textContent = `${formatValue(first)} ${symbols[pendingOperator]} ${formatValue(second)}`;
  currentValue = String(answer);
  storedValue = null;
  pendingOperator = null;
  shouldReset = true;
  updateDisplay();
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  pendingOperator = null;
  shouldReset = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldReset || currentValue === 'Error') return clearCalculator();
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  if (currentValue === '-') currentValue = '0';
  updateDisplay();
}

function percentage() {
  if (currentValue !== 'Error') {
    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
  }
}

keys.addEventListener('click', (event) => {
  const key = event.target.closest('button');
  if (!key) return;
  if (key.dataset.number !== undefined) inputNumber(key.dataset.number);
  else if (key.dataset.operator) chooseOperator(key.dataset.operator);
  else if (key.dataset.action === 'decimal') inputDecimal();
  else if (key.dataset.action === 'equals') equals();
  else if (key.dataset.action === 'clear') clearCalculator();
  else if (key.dataset.action === 'delete') deleteLast();
  else if (key.dataset.action === 'percent') percentage();
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === '.') inputDecimal();
  else if (event.key === 'Enter' || event.key === '=') equals();
  else if (event.key === 'Escape') clearCalculator();
  else if (event.key === 'Backspace') deleteLast();
  else if (event.key === '%') percentage();
  else if (event.key === '+') chooseOperator('add');
  else if (event.key === '-') chooseOperator('subtract');
  else if (event.key === '*') chooseOperator('multiply');
  else if (event.key === '/') chooseOperator('divide');
});

updateDisplay();
