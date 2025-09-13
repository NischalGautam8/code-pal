// Calculator core logic

// Global state variables
let currentInput = '';
let previousValue = null;
let pendingOperator = null;
const displayEl = document.getElementById('display');

/**
 * Updates the calculator display based on the current state.
 * Shows currentInput if present, otherwise previousValue, or '0' as fallback.
 */
function updateDisplay() {
  let text = '';
  if (currentInput !== '') {
    text = currentInput;
  } else if (previousValue !== null) {
    text = String(previousValue);
  } else {
    text = '0';
  }
  // Ensure we never show an empty string
  if (text === '' || text === undefined) text = '0';
  displayEl.textContent = text;
}

/**
 * Handles digit button presses.
 * Prevents multiple leading zeros.
 * @param {string} digit - The digit character pressed.
 */
function handleDigit(digit) {
  if (currentInput === '' && digit === '0') {
    // Allow a single leading zero
    currentInput = '0';
    updateDisplay();
    return;
  }
  if (currentInput === '0' && digit === '0') {
    // Ignore additional leading zeros
    return;
  }
  if (currentInput === '0' && digit !== '0') {
    // Replace leading zero with the new digit
    currentInput = digit;
  } else {
    currentInput += digit;
  }
  updateDisplay();
}

/**
 * Handles decimal point button.
 */
function handleDecimal() {
  if (currentInput === '') {
    currentInput = '0.';
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

/**
 * Performs basic arithmetic.
 * @param {number} a
 * @param {number} b
 * @param {string} operator
 * @returns {number|string} Result or 'Error' on division by zero.
 */
function compute(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return 'Error';
      return a / b;
    default:
      return b; // fallback
  }
}

/**
 * Handles operator button presses (+, -, *, /).
 * @param {string} op
 */
function handleOperator(op) {
  const inputNumber = currentInput !== '' ? parseFloat(currentInput) : null;

  if (pendingOperator && inputNumber !== null) {
    const result = compute(previousValue, inputNumber, pendingOperator);
    previousValue = result;
  } else if (previousValue === null) {
    previousValue = inputNumber !== null ? inputNumber : 0;
  }

  pendingOperator = op;
  currentInput = '';
  updateDisplay();
}

/**
 * Handles the equals button.
 */
function handleEquals() {
  if (!pendingOperator) return;
  const b = currentInput !== '' ? parseFloat(currentInput) : previousValue;
  const result = compute(previousValue, b, pendingOperator);
  previousValue = result;
  pendingOperator = null;
  currentInput = '';
  updateDisplay();
}

/**
 * Clears all state and resets the display.
 */
function clearAll() {
  currentInput = '';
  previousValue = null;
  pendingOperator = null;
  updateDisplay();
}

/**
 * Removes the last character from the current input.
 */
function backspace() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  }
}

// Attach event listeners to calculator buttons
document.querySelectorAll('.buttons button').forEach(btn => {
  btn.addEventListener('click', e => {
    const action = btn.dataset.action;
    const value = btn.textContent.trim();
    switch (action) {
      case 'digit':
        handleDigit(value);
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'operator':
        handleOperator(value);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'clear':
        clearAll();
        break;
      case 'backspace':
        backspace();
        break;
      default:
        // No action needed
        break;
    }
  });
});

// Export helper functions for testing purposes
window.calc = {
  compute,
  handleDigit,
  handleOperator,
  handleEquals,
  clearAll,
  backspace,
};

// Initial display update
updateDisplay();
