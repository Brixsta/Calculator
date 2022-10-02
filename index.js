window.onload = () => {
  let screenInput = [];
  const calc = document.querySelector(".calc-body");
  const calcScreen = document.querySelector(".calc-screen");
  const keys = [
    "+/-",
    "√",
    "%",
    "÷",
    "MRC",
    "M-",
    "M+",
    "x",
    7,
    8,
    9,
    "-",
    4,
    5,
    6,
    "+",
    1,
    2,
    3,
    "=",
    "ON/C",
    0,
    ".",
  ];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = {
    "+/-": null,
    "√": null,
    "%": null,
    "÷": null,
    'MRC': null,
    "M-": null,
    "M+": null,
    'x': 'multiply',
    "-": (a, b) => {
      return a - b;
    },
    "+": "plus sign",
    "=": "equals sign",
  };

  // function to check for adjacent operators
  const noAdjacentOperators = (arr) => {
    let result = true;
    for (let i = 0; i < arr.length; i++) {
      let current = arr[i];
      let next = arr[i + 1];

      if (operators[current] && operators[next]) {
        result = false;
      }
    }
    return result;
  };

  // function to find num of Operators
  const findNumOfOperators = (arr) => {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (operators[arr[i]]) {
        count++;
      }
    }
    return count;
  };

  // convert stringy nums to real nums
  const numConverter = (arr) => {
    let newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      let current = arr[i];

      if (numbers.includes(Number(current))) {
        newArr[i] = Number(newArr[i]);
      }
    }
    return newArr;
  };

  // function to calculate equation
  const findAnswer = (arr) => {
    const numberedArr = numConverter(arr);
    return numberedArr;
  };

  // function to build the calculator
  const buildCalc = () => {
    const numOfCols = 4;
    const numOfRows = 6;
    const keyHeight = 40;
    const keyWidth = 60;

    for (let row = 0; row < numOfRows; row++) {
      for (let col = 0; col < numOfCols; col++) {
        const arrayIndex = row * numOfCols + col;
        const key = document.createElement("button");
        key.style.height = keyHeight + "px";
        key.style.width = keyWidth + "px";
        key.classList.add("key");
        calc.append(key);

        key.innerHTML = keys[arrayIndex];

        // remove undefined key
        if (key.innerHTML === "undefined") {
          key.remove();
        }

        // give number keys a white background and black text
        if (typeof keys[arrayIndex] === "number") {
          key.style.backgroundColor = "white";
          key.style.color = "black";
        }

        // event listener for key press
        key.addEventListener("click", () => {
          // reset text align after equal sign is pressed
          calcScreen.style.textAlign = "left";

          // make sure equal sign is not displayed when pressed
          if (key.innerHTML !== "=") {
            screenInput.push(key.innerHTML);
          }

          let displayedContent;
          displayedContent = screenInput.join().replace(/,/g, "");

          // clear screen when on button is pressed
          if (key.innerHTML === "ON/C") {
            displayedContent = "";
            screenInput = [];
          }

          if (key.innerHTML === "=") {
            const adjacentOperators = !noAdjacentOperators(screenInput);
            const numOfOperators = findNumOfOperators(screenInput);
            const answer = findAnswer(screenInput);
            const lastVal = screenInput[screenInput.length - 1];

            // if num of Operators is 0 just return the number typed in
            if (numOfOperators === 0) {
              calcScreen.style.textAlign = "right";
            }

            // if two or more operators are typed next to each other, display an error
            if (adjacentOperators || Object.keys(operators).includes(lastVal)) {
              displayedContent = "SYNTAX ERROR";
              screenContent = [];
            }

            // console.log("equal sign prssed");
            console.log(screenInput, displayedContent);
            console.log(answer);
          }
          calcScreen.value = displayedContent;
        });
      }
    }
  };

  buildCalc();
};
