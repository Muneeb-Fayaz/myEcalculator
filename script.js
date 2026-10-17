// Muneeb's Scientific Calculator
// Everything the calculator does lives in this file.

// ---------- grab the things on the page ----------
var expressionEl = document.getElementById("expression");
var resultEl = document.getElementById("result");
var angleEl = document.getElementById("angle-mode");
var memoryFlagEl = document.getElementById("memory-flag");
var buttonsEl = document.getElementById("buttons");

// ---------- the calculator's memory ----------
var expression = "";          // what the user has typed so far
var lastAnswer = 0;           // used by the Ans button
var memory = 0;               // used by M+ and MR
var justPressedEquals = false;
var useDegrees = true;        // false means radians


// ======================================================
//  PART 1: turning the typed text into a number
// ======================================================

// Names of the functions. Each one is typed with its opening bracket.
var functionNames = ["sin(", "cos(", "tan(", "ln(", "log(", "√(", "exp("];

function isDigit(ch) {
  return ch >= "0" && ch <= "9";
}

// Break the text up into small pieces (numbers, operators, functions...)
function tokenize(text) {
  var tokens = [];
  var i = 0;

  while (i < text.length) {
    var ch = text[i];

    // numbers like 12, 3.5, .5 and 2E5
    if (isDigit(ch) || ch === ".") {
      var num = "";
      while (i < text.length && (isDigit(text[i]) || text[i] === ".")) {
        num += text[i];
        i++;
      }
      // optional exponent part, like E5 or E-3
      if (text[i] === "E") {
        var next = text[i + 1];
        var afterSign = text[i + 2];
        if (isDigit(next) || ((next === "+" || next === "−" || next === "-") && isDigit(afterSign))) {
          num += "E";
          i++;
          if (!isDigit(text[i])) {
            num += (text[i] === "+") ? "+" : "-";
            i++;
          }
          while (i < text.length && isDigit(text[i])) {
            num += text[i];
            i++;
          }
        }
      }
      tokens.push(num);
      continue;
    }

    // the Ans word
    if (text.startsWith("Ans", i)) {
      tokens.push("Ans");
      i += 3;
      continue;
    }

    // functions like sin( or ln(
    var foundFunction = false;
    for (var f = 0; f < functionNames.length; f++) {
      if (text.startsWith(functionNames[f], i)) {
        tokens.push(functionNames[f]);
        i += functionNames[f].length;
        foundFunction = true;
        break;
      }
    }
    if (foundFunction) continue;

    // single characters: operators, brackets, e and pi
    if ("+−-×÷^()%!eπ".indexOf(ch) !== -1) {
      tokens.push(ch);
      i++;
      continue;
    }

    // anything else is not allowed
    throw new Error("Syntax");
  }

  return tokens;
}

function factorial(n) {
  if (n < 0 || n !== Math.floor(n) || n > 170) {
    throw new Error("Math");
  }
  var result = 1;
  for (var i = 2; i <= n; i++) {
    result = result * i;
  }
  return result;
}

// Work out the value of a function like sin(30)
function runFunction(name, value) {
  var angle = value;
  if (useDegrees) {
    angle = value * Math.PI / 180;
  }

  var answer;

  if (name === "sin(") {
    answer = Math.sin(angle);
  } else if (name === "cos(") {
    answer = Math.cos(angle);
  } else if (name === "tan(") {
    if (Math.abs(Math.cos(angle)) < 1e-12) throw new Error("Math");
    answer = Math.tan(angle);
  } else if (name === "ln(") {
    if (value <= 0) throw new Error("Math");
    return Math.log(value);
  } else if (name === "log(") {
    if (value <= 0) throw new Error("Math");
    return Math.log10(value);
  } else if (name === "√(") {
    if (value < 0) throw new Error("Math");
    return Math.sqrt(value);
  } else if (name === "exp(") {
    return Math.exp(value);
  }

  // tiny numbers like 6e-17 are really just zero (sin(180) for example)
  if (Math.abs(answer) < 1e-14) answer = 0;
  return answer;
}

// The main calculating function.
// It follows the usual maths rules: brackets, then powers,
// then multiply/divide, then add/subtract.
function calculate(text) {
  var tokens = tokenize(text);
  var pos = 0;   // where we are in the list of tokens

  function look() {
    return tokens[pos];
  }

  // does this token look like the start of a number/bracket/function?
  function startsValue(token) {
    if (token === undefined) return false;
    if (isDigit(token[0]) || token[0] === ".") return true;
    if (token === "e" || token === "π" || token === "Ans" || token === "(") return true;
    return functionNames.indexOf(token) !== -1;
  }

  // + and -
  function addSub() {
    var value = mulDiv();
    while (look() === "+" || look() === "−" || look() === "-") {
      var op = tokens[pos];
      pos++;
      var right = mulDiv();
      if (op === "+") value = value + right;
      else value = value - right;
    }
    return value;
  }

  // × and ÷ (also handles things like 2e or 3(4) where × is left out)
  function mulDiv() {
    var value = negative();
    while (true) {
      var token = look();
      if (token === "×") {
        pos++;
        value = value * negative();
      } else if (token === "÷") {
        pos++;
        var divisor = negative();
        if (divisor === 0) throw new Error("Divide by 0");
        value = value / divisor;
      } else if (startsValue(token)) {
        value = value * power();
      } else {
        break;
      }
    }
    return value;
  }

  // a minus sign in front of something, like -5
  function negative() {
    if (look() === "−" || look() === "-") {
      pos++;
      return -negative();
    }
    if (look() === "+") {
      pos++;
      return negative();
    }
    return power();
  }

  // x^y
  function power() {
    var base = suffix();
    if (look() === "^") {
      pos++;
      var exponent = negative();
      base = Math.pow(base, exponent);
    }
    return base;
  }

  // % and ! that come after a value
  function suffix() {
    var value = basic();
    while (look() === "%" || look() === "!") {
      if (look() === "%") value = value / 100;
      else value = factorial(value);
      pos++;
    }
    return value;
  }

  // the smallest pieces: numbers, e, pi, brackets, functions
  function basic() {
    var token = tokens[pos];
    pos++;

    if (token === undefined) throw new Error("Syntax");

    if (isDigit(token[0]) || token[0] === ".") return parseFloat(token);
    if (token === "e") return Math.E;
    if (token === "π") return Math.PI;
    if (token === "Ans") return lastAnswer;

    if (token === "(" || functionNames.indexOf(token) !== -1) {
      var inside = addSub();
      // if the user forgot the closing bracket we just close it for them
      if (look() === ")") pos++;
      if (token === "(") return inside;
      return runFunction(token, inside);
    }

    throw new Error("Syntax");
  }

  var answer = addSub();

  // skip any extra closing brackets at the end
  while (look() === ")") pos++;

  // if there is still stuff left over, something was wrong
  if (pos < tokens.length) throw new Error("Syntax");
  if (!isFinite(answer)) throw new Error("Math");

  return answer;
}


// ======================================================
//  PART 2: showing things on the screen
// ======================================================

// make a number look nice (no long 0.30000000000000004 stuff)
function formatNumber(value) {
  if (value === 0) return "0";

  var size = Math.abs(value);
  if (size >= 1e12 || size < 1e-9) {
    var text = value.toExponential(8);
    text = text.replace(/\.?0+e/, "e");
    return text.replace("e+", "E").replace("e", "E");
  }

  return String(parseFloat(value.toPrecision(12)));
}

function updateScreen() {
  expressionEl.textContent = expression;
  expressionEl.scrollLeft = expressionEl.scrollWidth;
  resultEl.classList.remove("error");

  if (expression === "") {
    resultEl.textContent = justPressedEquals ? formatNumber(lastAnswer) : "0";
  } else {
    // show a live preview of the answer while typing
    try {
      resultEl.textContent = formatNumber(calculate(expression));
    } catch (err) {
      resultEl.textContent = "";
    }
  }

  // use smaller text if the number is long
  if (resultEl.textContent.length > 12) {
    resultEl.classList.add("small");
  } else {
    resultEl.classList.remove("small");
  }
}

function showError(message) {
  resultEl.textContent = message;
  resultEl.classList.add("error");
  resultEl.classList.remove("small");
}


// ======================================================
//  PART 3: what happens when buttons are pressed
// ======================================================

// add something to the expression
function addToExpression(text) {
  var isOperator = "+−×÷^%!".indexOf(text) !== -1 || text === "^2";

  // after pressing "=", typing a number starts fresh,
  // but typing an operator carries on from the answer
  if (justPressedEquals) {
    if (isOperator) expression = "Ans";
    else expression = "";
    justPressedEquals = false;
  }

  // if the last thing was an operator and a new one is pressed, swap them
  var isBasicOperator = "+−×÷".indexOf(text) !== -1;
  var lastChar = expression[expression.length - 1];
  if (isBasicOperator && lastChar && "+−×÷".indexOf(lastChar) !== -1) {
    expression = expression.slice(0, -1);
  }

  // an operator on an empty screen continues from the last answer
  if (expression === "" && "×÷^%!".indexOf(text[0]) !== -1) {
    expression = (lastAnswer !== 0) ? "Ans" : "0";
  }

  expression = expression + text;
  updateScreen();
}

function pressEquals() {
  if (expression === "") return;

  try {
    var answer = calculate(expression);
    var oldExpression = expression;

    lastAnswer = answer;
    justPressedEquals = true;
    expression = formatNumber(answer);   // so we can keep calculating from it

    expressionEl.textContent = oldExpression + " =";
    resultEl.textContent = formatNumber(answer);
    resultEl.classList.remove("error");
    resultEl.classList.toggle("small", resultEl.textContent.length > 12);
  } catch (err) {
    if (err.message === "Divide by 0") showError("Divide by 0");
    else if (err.message === "Syntax") showError("Syntax ERROR");
    else showError("Math ERROR");
  }
}

function clearAll() {
  expression = "";
  justPressedEquals = false;
  updateScreen();
}

// delete the last thing typed (a whole function name counts as one thing)
function deleteLast() {
  if (justPressedEquals) {
    expression = "";
    justPressedEquals = false;
    updateScreen();
    return;
  }

  var removed = false;

  if (expression.endsWith("Ans")) {
    expression = expression.slice(0, -3);
    removed = true;
  }

  for (var i = 0; i < functionNames.length && !removed; i++) {
    if (expression.endsWith(functionNames[i])) {
      expression = expression.slice(0, -functionNames[i].length);
      removed = true;
    }
  }

  if (!removed) {
    expression = expression.slice(0, -1);
  }

  updateScreen();
}

// the +/- button: wraps everything in -( ) or takes it off again
function negate() {
  justPressedEquals = false;

  var alreadyNegative = expression.startsWith("−(") && expression.endsWith(")");

  if (alreadyNegative) {
    expression = expression.slice(2, -1);
  } else if (expression === "") {
    expression = "−";
  } else {
    expression = "−(" + expression + ")";
  }

  updateScreen();
}

function toggleAngleMode() {
  useDegrees = !useDegrees;
  angleEl.textContent = useDegrees ? "DEG" : "RAD";
  updateScreen();
}

function memoryAdd() {
  try {
    var value = (expression === "") ? lastAnswer : calculate(expression);
    memory = memory + value;
    memoryFlagEl.textContent = "M";
  } catch (err) {
    showError("Math ERROR");
  }
}

function memoryRecall() {
  addToExpression(formatNumber(memory));
}

// decide what to do for each special button
function handleAction(action) {
  if (action === "equals") pressEquals();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
  else if (action === "negate") negate();
  else if (action === "angle") toggleAngleMode();
  else if (action === "memory-add") memoryAdd();
  else if (action === "memory-recall") memoryRecall();
}

// one listener for every button on the calculator
buttonsEl.addEventListener("click", function (event) {
  var button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.insert !== undefined) {
    addToExpression(button.dataset.insert);
  } else {
    handleAction(button.dataset.action);
  }
});


// ======================================================
//  PART 4: keyboard support
// ======================================================

document.addEventListener("keydown", function (event) {
  var key = event.key;

  if ("0123456789.()".indexOf(key) !== -1 && key.length === 1) {
    addToExpression(key);
  } else if (key === "+") {
    addToExpression("+");
  } else if (key === "-") {
    addToExpression("−");
  } else if (key === "*") {
    addToExpression("×");
  } else if (key === "/") {
    event.preventDefault();   // stops the browser's quick-find popup
    addToExpression("÷");
  } else if (key === "^" || key === "%" || key === "!") {
    addToExpression(key);
  } else if (key === "e") {
    addToExpression("e");
  } else if (key === "p") {
    addToExpression("π");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    pressEquals();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape" || key === "Delete") {
    clearAll();
  }
});

// show the starting screen
updateScreen();
