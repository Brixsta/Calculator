window.onload = () => {
  let screenInput = [];
  let oldDisplayedContent;
  let displayedContent;
  let result = [];
  const calcBody = document.querySelector(".calc-body");
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
    "√": (a,b) => {

      if(a === undefined) {
        a = 1;
      }
        return a * Math.sqrt(b);
    },
    "%": (a)=> {
      return a/100;
    },
    "÷": (a,b)=>{
      return a/b;
    },
    'MRC': null,
    "M-": null,
    "M+": null,
    'x': (a,b)=> {
      return a * b;
    },
    "-": (a, b) => {
      return a - b;
    },
    "+": (a,b)=>{
      return a+b;
    },
    "=": "equals sign",
  };

  // check for adjacent operators
  const noAdjacentOperators = (arr) => {
    let result = true;
    for (let i = 0; i < arr.length; i++) {
      let current = arr[i];
      let next = arr[i + 1];

      if (operators[current] && operators[next] && current !== '%' && next !== '%') {
        result = false;
      }
    }
    return result;
  };

  // check to find num of Operators
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
  const stringyNumsToRealNums = (arr) => {
    let newArr = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      let current = arr[i];

      if (numbers.includes(Number(current))) {
        newArr[i] = Number(newArr[i]);
      }
    }
    return newArr;
  };

  // group digits to form numbers
  const groupDigits = (arr) => {
    const result = [];
    let digitBlock = '';
    for(let i=0; i<arr.length; i++) {
      let current = arr[i];

      if(typeof current === 'number') {
        digitBlock+= current;
      }

      if(typeof current !== 'number') {
        result.push(Number(digitBlock));
        result.push(current)
        digitBlock = '';
      }

      if(typeof current === 'number' && i === arr.length-1) {
        result.push(Number(digitBlock));
        digitBlock = '';
      }
    }
    return result;
  }

  // percentage sign array values
  const percentageSignArray = (arr) => {
    for(let i=0; i<arr.length; i++) {
     let current = arr[i];
     let prev = arr[i-1];
     let next = arr[i+1];
 
     if(current === '%' && !next) {
       let value = operators[current](prev);
       arr[i+1] = value;
       arr.splice(i-1,2);
       i = 0;
     } else if(current === '%' && numbers.includes(next)) {
      let value = operators[current](prev);
      arr[i+1] = value * next;
      arr.splice(i-1,2);
      i = 0;
    } 
    }
  
    return arr;
   }

  // squareRoot array values
  const squareRootArray = (arr) => {
   for(let i=0; i<arr.length; i++) {
    let current = arr[i];
    let prev = arr[i-1];
    let next = arr[i+1];

    if(current === '√' && prev) {
      let value = operators[current](prev,next);
      arr[i+1] = value;
      arr.splice(i-1,2);
      i = 0;
    } 

    if(current === '√' && !prev) {
      let value = operators[current](prev,next);
      arr[i] = value;
      arr.splice(i-1,2);
      i = 0;
    } 

   }
   return arr;
  }

  // multiplyAndDivide array values
  const multiplyAndDivideArray = (arr) => {
   for(let i=0; i<arr.length; i++) {
    let current = arr[i];
    let prev = arr[i-1];
    let next = arr[i+1];

    if(current === 'x') {
      let value = operators[current](prev,next);
      arr[i+1] = value;
      arr.splice(i-1,2);
      i = 0;
    } else if(current === '÷') {
      let value = operators[current](prev,next);
      arr[i+1] = value;
      arr.splice(i-1,2);
      i = 0;
    } 
   }
   
   return arr;
  }

  // add and subtract array values
  const addSubtractArray = (arr) => {
   for(let i=0; i<arr.length; i++) {
    let current = arr[i];
    let prev = arr[i-1];
    let next = arr[i+1];

    if(current === '+') {
      let value = operators[current](prev,next);
      arr[i+1] = value;
      arr.splice(i-1,2);
      i = 0;
    } else if(current === '-') {
      let value = operators[current](prev,next);
      arr[i+1] = value;
      arr.splice(i-1,2);
      i = 0;
    } 
   }

   return arr;
  }

  // function to calculate equation
  const findAnswer = (arr) => {
    const numberedArr = stringyNumsToRealNums(arr);
    const grouped = groupDigits(numberedArr);
    const applyPercentageSign = percentageSignArray(grouped);
    const squareRooted = squareRootArray(applyPercentageSign);
    const mAndDivide = multiplyAndDivideArray(squareRooted);
    const addAndSubtract = addSubtractArray(mAndDivide);

    return addAndSubtract[0];
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
        calcBody.append(key);
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
          // screenInput = oldDisplayedContent;

          // make sure equal sign is not displayed when pressed
          if (key.innerHTML !== "=") {
            screenInput.push(key.innerHTML);
          }

          displayedContent = oldDisplayedContent;
          displayedContent = screenInput.join().replace(/,/g, "");
          displayedContent = displayedContent.replace(/x/g, "*")
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
            console.log(answer);
            oldDisplayedContent = displayedContent;
            displayedContent = answer;
            calcScreen.style.textAlign = "right";
            result = [];
          }
          calcScreen.value = displayedContent;
        });
      }
    }
  };

  buildCalc();
};
