function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b == 0) {
    return "Inf";
  }
  return a / b;
}

function operate(a, operator, b) {
  a = +a;
  b = +b;
  switch (operator) {
    case "+":
      return add(a, b);
      break;
    case "-":
      return subtract(a, b);
      break;
    case "x":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
      break;
    default:
      return a; // User only enters a single number
  }
}

const calculator = document.querySelector("#calculator");
function createCalculator() {
  calculator.appendChild(createCalculatorScreen());
  for (let i = 1; i <= 5; i++) {
    calculator.appendChild(createCalculatorRow(i));
  }
}

function createCalculatorScreen() {
  const calculatorScreen = document.createElement("div");
  calculatorScreen.setAttribute("id", "calculatorScreen");
  const calculatorScreenTop = document.createElement("div");
  calculatorScreenTop.setAttribute("id", "calculatorScreenTop");
  calculatorScreen.appendChild(calculatorScreenTop);
  const calculatorScreenBottom = document.createElement("div");
  calculatorScreenBottom.setAttribute("id", "calculatorScreenBottom");
  calculatorScreen.appendChild(calculatorScreenBottom);
  return calculatorScreen;
}

function createCalculatorRow(rowNum) {
  const row = document.createElement("div");
  row.setAttribute("id", "row" + rowNum);
  row.setAttribute("class", "calculatorRow");
  return row;
}

function createButton({ content, fontSize = 14, disabled = false }) {
  const button = document.createElement("button");
  button.textContent = content;
  if (content == "=") {
    button.setAttribute("id", "btnEq");
  } else button.setAttribute("id", "btn" + content);
  button.style.fontSize = fontSize + "px";
  button.disabled = disabled;
  return button;
}

// Basic calculator layout
createCalculator();

// Row 1
const row1 = document.querySelector("#row1");
row1.appendChild(createButton({ content: "del", disabled: true }));
row1.appendChild(createButton({ content: "AC" }));
row1.appendChild(createButton({ content: "%", disabled: true }));
row1.appendChild(createButton({ content: "÷", fontSize: 24 })); // Division sign, NOT plus sign!

// Row 2
const row2 = document.querySelector("#row2");
row2.appendChild(createButton({ content: "7" }));
row2.appendChild(createButton({ content: "8" }));
row2.appendChild(createButton({ content: "9" }));
row2.appendChild(createButton({ content: "x", fontSize: 18 }));

// Row 3
const row3 = document.querySelector("#row3");
row3.appendChild(createButton({ content: "4" }));
row3.appendChild(createButton({ content: "5" }));
row3.appendChild(createButton({ content: "6" }));
row3.appendChild(createButton({ content: "-", fontSize: 24 }));

// Row 4
const row4 = document.querySelector("#row4");
row4.appendChild(createButton({ content: "1" }));
row4.appendChild(createButton({ content: "2" }));
row4.appendChild(createButton({ content: "3" }));
row4.appendChild(createButton({ content: "+", fontSize: 20 }));

// Row 5
const row5 = document.querySelector("#row5");
row5.appendChild(createButton({ content: "neg", disabled: true }));
row5.appendChild(createButton({ content: "0" }));
row5.appendChild(createButton({ content: ".", fontSize: 20, disabled: true }));
row5.appendChild(createButton({ content: "=", fontSize: 20 }));

// Button interactivity
const buttons = document.querySelectorAll("button");
const specialButtons = ["AC", "="];
buttons.forEach((button) => {
  if (
    button.disabled == false &&
    !specialButtons.includes(button.textContent)
  ) {
    button.addEventListener("click", () => populateScreen(button.textContent));
  }
});

document.addEventListener("keydown", (event) => pressButton(event));

const activeButtons = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "AC",
  "÷",
  "x",
  "-",
  "+",
  "=",
];
function pressButton(event) {
  let buttonContent = "";
  if (event.key == "Escape") {
    clearScreen();
    return;
  } else if (event.key == "/") {
    buttonContent = "÷";
  } else if (event.key == "*") {
    buttonContent = "x";
  } else if (["=", "Enter"].includes(event.key)) {
    evaluateExpression();
    return;
  } else if (activeButtons.includes(event.key)) {
    buttonContent = event.key;
  }
  populateScreen(buttonContent);
}

function populateScreen(value) {
  // Clear result from previously evaluated expression if one exists
  if (calculatorScreenTop.textContent != "") {
    clearScreen();
  }
  calculatorScreenBottom.textContent += value;
}

// Clear screen
function clearScreen() {
  calculatorScreenTop.textContent = "";
  calculatorScreenBottom.textContent = "";
}

const clearButton = document.querySelector("#btnAC");
clearButton.addEventListener("click", () => clearScreen());

// Calculate result
const operators = ["+", "-", "x", "÷"];
const equalButton = document.querySelector("#btnEq");
equalButton.addEventListener("click", () => evaluateExpression());

function evaluateExpression() {
  const expression = calculatorScreenBottom.textContent;
  calculatorScreenTop.textContent = expression;
  if (expressionIsValid(expression)) {
    calculatorScreenBottom.textContent = operate(
      ...decomposeExpression(expression),
    );
  } else {
    calculatorScreenBottom.textContent = "Invalid";
  }
}

function expressionIsValid(expression) {
  let operatorIndices = operators
    .map((op) => expression.indexOf(op))
    .filter((index) => index >= 0);

  // Check that there's no more than 1 operator
  if (operatorIndices.length > 1) {
    return false;
  }

  // Check if the operator is the first term. Allow + and -
  if (["x", "÷"].includes(expression[0])) {
    return false;
  }

  // Check for only a single, non-operator term
  if (operatorIndices.length == 0 && !isNaN(+expression)) {
    return true;
  }

  let operator = expression[operatorIndices[0]];
  let terms = expression.split(operator);

  // Check that there is a term on either side of the operator
  if (terms.length != 2) {
    return false;
  }

  return true;
}

function decomposeExpression(expression) {
  if (expressionIsValid(expression)) {
    let operatorIndices = operators
      .map((op) => expression.indexOf(op))
      .filter((index) => index >= 0);
    let operator = expression[operatorIndices[0]];
    let nums = expression.split(operator);
    return [nums[0], operator, nums[1]];
  } else {
    console.log("Invalid expression found: ", expression);
    return [];
  }
}
