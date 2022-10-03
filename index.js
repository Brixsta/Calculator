window.onload = () => {
  let screenInput = [];
  let displayedContent;
  const calcBody = document.querySelector(".calc-body");
  const calcScreen = document.querySelector(".calc-screen");
  const keys = ['AC', '+/-', "%", "÷", 7, 8, 9, 'x', 4,5,6,'-',1,2,3,'+', 0, '.', '='];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = {
    "AC": 'ac',
    "+/-": (a)=> {
      return a*-1;
    },
    "%": (a)=> {
      return a/100;
    },
    "÷": (a,b)=>{
      return a/b;
    },
    'x': (a,b)=> {
      return a * b;
    },
    "-": (a, b) => {
      return a - b;
    },
    "+": (a,b)=>{
      return a+b;
    },
    "=": "equals sign"
  };

  // modified operators does not include the % sign
  const modifiedOperators = {...operators};
  delete modifiedOperators['%'];

  // check for syntax errors
  const checkForSyntaxErrors = (arr) => {
    let result = true;
    for (let i = 0; i < arr.length; i++) {
      let prev = arr[i-1];
      let current = arr[i];
      let next = arr[i + 1];

      if (modifiedOperators[current] && modifiedOperators[next]) {
        result = false;
      }
      if(arr[arr.length-1] === "%" && arr[arr.length-2] === "%") {
        result = false;
      }
      if(current === "%" && next === "%") {
        result = false;
      }
      if(operators[prev] && current === "%") {
        result = false;
      }
      if(current === '.' && next === '.') {
        result = false;
      }
      if(arr[0] === 'x' && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr[0] === '-' && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr[0] === '+' && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr[0] === '%' && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr[0] === "÷" && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr[0] === "+/-" && typeof Number(arr[1]) === 'number') {
        return false;
      }
      if(arr.length === 1 && arr[0] === '.') {
        return false;
      }
    }
    return result;
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
    console.log('stringyNumsToRealNums:', arr)
    return newArr;
  };

  // group digits to form numbers
  const groupDigits = (arr) => {
    const result = [];
    let digitBlock = '';
    for(let i=0; i<arr.length; i++) {
      let current = arr[i];
      let prev = arr[i-1];

      if(typeof current === 'number') {
        digitBlock+= current;
      }

      if(current === '.' && !prev) {
        console.log('here')
        digitBlock += '0' + current;
      } else if (current === '.') {
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
    console.log(  'group digits: ', result)
    return result;
  }

  // deal with decimals
  const applyDecimals = (arr) => {
    for(let i=0; i<arr.length; i++) {
      let current = arr[i];
      let prev = arr[i-1];
      let next = arr[i+1];
      if(current === '.' && typeof prev === 'number' && typeof next === 'number') {
        let combined = Number(prev + current + next + '');
        arr[i+1] = combined;
        arr.splice(i-1,2)
      }
      // } else if (current === '.' && !prev && typeof next === 'number') {
      //   let combined = Number(current + next + '');
      //   arr[i+1] = combined;
      //   arr.splice(i,1);
      //   console.log('combined: ', combined);
      //   console.log('arr', arr)
      // }
    }
    console.log('apply Decimals',arr)
    return arr;
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
       console.log(`prev is: ${prev}, value is: ${value}`)
     } else if(current === '%' && numbers.includes(next)) {
      let value = operators[current](prev);
      arr[i+1] = value * next;
      arr.splice(i-1,2);
      i = 0;
    } 
    
    }
    
    console.log('percentage arr:', arr)
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
   console.log('multiplydivide arr:', arr)
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
    console.log('first: ', arr);
    
    const numberedArr = stringyNumsToRealNums(arr);
    const groupArr = groupDigits(numberedArr);
    const decimalArr = applyDecimals(groupArr)
    const percentageSignArr = percentageSignArray(decimalArr);
    const mAndDivide = multiplyAndDivideArray(percentageSignArr);
    const addAndSubtract = addSubtractArray(mAndDivide);

    return addAndSubtract[0];
  };

  // function to build the calculator
  const buildCalc = () => {
    const numOfCols = 4;
    const numOfRows = 6;
    const keyHeight = 60;
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

        // styling number keys
        if (typeof keys[arrayIndex] === "number" || keys[arrayIndex] === '.') {
          key.style.backgroundColor = "#313131";
          key.style.color = "white";
        }else if(keys[arrayIndex] ===  "÷" || keys[arrayIndex] ===  "x" || keys[arrayIndex] ===  "+" || keys[arrayIndex] ===  "-" || keys[arrayIndex] ===  "=") {
          key.style.backgroundColor = "#f69906";
          key.style.color = "white";
        } else {
          key.style.backgroundColor = "#9f9f9f";
          key.style.color = "black";
        }

        if(keys[arrayIndex] === 0) {
          key.style.width = "128px";
          key.style.borderRadius = "30px"
        }

        // event listener for key press
        key.addEventListener("click", () => {

          // reset screen Font size
          calcScreen.style.fontSize = "50px";

          // make sure equal sign is not displayed when pressed
          if (key.innerHTML !== "=") {
            screenInput.push(key.innerHTML);
          }

          displayedContent = screenInput.join().replace(/,/g, "");
          displayedContent = displayedContent.replace(/x/g, "*")
          // clear screen when on button is pressed
          if (key.innerHTML === "AC") {
            displayedContent = "";
            screenInput = [];
          }

          if (key.innerHTML === "=") {
            const syntaxErrorCheck = !checkForSyntaxErrors(screenInput);
            let answer = findAnswer(screenInput);
            const lastVal = screenInput[screenInput.length - 1];

            // if two or more operators are typed next to each other, display an error
            if (syntaxErrorCheck || modifiedOperators[lastVal] || lastVal === "%" && screenInput.length === 1) {
              calcScreen.style.fontSize = "30px";
              displayedContent = "SYNTAX ERROR";
              screenContent = [];
              calcScreen.value = displayedContent;
              return;
            }
            displayedContent = answer;
            screenInput = [answer]
          }
            calcScreen.value = displayedContent;
        });
      }
    }
  };

  buildCalc();
};
