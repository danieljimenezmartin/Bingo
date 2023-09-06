let userNumbersElement = document.getElementById("user-numbers");
let pcNumbersElement = document.getElementById("pc-numbers");
const bingoNumbersElement = document.getElementById("bingo-numbers");

//Generamos una función para generar número aleatorio en la que le pasemos el número mayor
const randomNumber = maxNumber => Math.floor(Math.random() * maxNumber + 1);

let arrayNumber = [];
let number;

// Incluímos el número aleatorio en una array y cuando tenemos 15 números llamamos a la función fillCard()

const fillArray = itemCard => {
  number = randomNumber(99);
  if (arrayNumber.length !== 15) {
    if (!arrayNumber.includes(number)) {
      arrayNumber.push(number);
    }
    return fillArray(itemCard);
  } else {
    fillCard(arrayNumber, itemCard);
  }
};

//Generamos el código html para que aparezcan las tarjetas con los números que contiene la array

const fillCard = (array, itemCard) => {
  const fragment = document.createDocumentFragment();
  for (number of array) {
    const newSpan = document.createElement("span");
    newSpan.textContent = number;
    fragment.append(newSpan);
  }
  itemCard.append(fragment);
};

//Generamos el cartón del usuario
fillArray(userNumbersElement);
//Reiniciamos la array para que vuelvan a generarse 15 números aleatorios
arrayNumber = [];
//Generamos el cartón de la máquina
fillArray(pcNumbersElement);

//Generamos una array con números del 1 al 99
let arrayAllNumbers = [];
const fillBingoNumber = () => {
  while (arrayAllNumbers.length < 99) {
    for (i = 1; i <= 99; i++) {
      arrayAllNumbers.push(i);
    }
  }
};
fillBingoNumber();

//Generamos la tabla con los 99 números del bingo aprovechando la función fillCard
fillCard(arrayAllNumbers, bingoNumbersElement);

//Función para marcar en el cartón del bingo los números obtenidos
const numbersBingoElements = document.querySelectorAll("#bingo-numbers span");
const bingoNumberSelectedElement = document.getElementById("number-selected");
const startButtonElement = document.getElementById("start");
const restartButtonElement = document.getElementById("restart");

const markNumberBingo = (array, number) => {
  bingoNumberSelectedElement.textContent = `Número: ${number}`;
  for (const item of array) {
    if (Number(item.textContent) === number) {
      item.classList.add("pull");
    }
  }
};

//Comprobamos si el número aparece en los cartones tanto del usuario como del pc y lo marcamos

const numbersUserElements = document.querySelectorAll("#user-numbers span");
const numbersPcElements = document.querySelectorAll("#pc-numbers span");
let counterUser = 0;
let counterPc = 0;

const markNumber = (array, number) => {
  for (const item of array) {
    if (Number(item.textContent) === number) {
      item.classList.add("pull");
      array === numbersUserElements ? counterUser++ : counterPc++;
    }
    showMessages(counterUser, counterPc);
  }
};

//Extraemos de la array de 99 números un número aleatorio y enviamos a la función markNumberBingo el número extraído
const generateNumberFunction = () => {
  console.log(counterUser);
  console.log(counterPc);
  if (counterUser === 15 || counterPc === 15) return;
  let generatedNumber = arrayAllNumbers[Math.floor(Math.random() * arrayAllNumbers.length)];
  markNumberBingo(numbersBingoElements, generatedNumber);
  markNumber(numbersUserElements, generatedNumber);
  markNumber(numbersPcElements, generatedNumber);
  arrayAllNumbers = arrayAllNumbers.filter(number => number != generatedNumber);
};

const userMessageElement = document.getElementById("user-message");
const pcMessageElement = document.getElementById("pc-message");

const showMessages = (counterUser, counterPc) => {
  if (counterUser === 15 && counterPc === 15) {
    userMessageElement.textContent = "DRAW";
    pcMessageElement.textContent = "DRAW";
  } else if (counterUser === 15 && counterPc !== 15) {
    userMessageElement.textContent = "USER WIN";
    pcMessageElement.textContent = "PC LOSE";
  } else if (counterUser !== 15 && counterPc === 15) {
    userMessageElement.textContent = "USER LOST";
    pcMessageElement.textContent = "PC WIN";
  } else {
    return;
  }
};

//Añadir la función al botón restart
restartButtonElement.addEventListener("click", () => {
  restartButtonElement.classList.add("hidden");
  arrayAllNumbers = [];
  fillBingoNumber();
  for (const item of numbersBingoElements) {
    item.classList.remove("pull");
  }
  for (const item of numbersUserElements) {
    item.classList.remove("pull");
  }
  for (const item of numbersPcElements) {
    item.classList.remove("pull");
  }
  bingoNumberSelectedElement.textContent = "";
  userMessageElement.textContent = "";
  pcMessageElement.textContent = "";
  startButtonElement.classList.remove("hidden");
  // changeCardsButtonElement.classList.remove("hidden");
  counterUser = 0;
  counterPc = 0;
});

//Botón para cambiar los números de los cartones
const changeCardsButtonElement = document.getElementById("change-cards");

changeCardsButtonElement.addEventListener("click", () => {
  userNumbersElement.textContent = "";
  pcNumbersElement.textContent = "";
  userNumbersElement = document.getElementById("user-numbers");
  pcNumbersElement = document.getElementById("pc-numbers");
  fillArray(userNumbersElement);
  arrayNumber = [];
  fillArray(pcNumbersElement);
});

//Ejecutamos la función generar número cada medio segundo

function getBingoNewNumber() {
  const intervalId = setInterval(() => {
    if (counterUser === 15 || counterPc === 15) {
      clearInterval(intervalId);
      restartButtonElement.classList.remove("hidden");
    }
    generateNumberFunction();
  }, 100);
}

startButtonElement.addEventListener("click", () => {
  startButtonElement.classList.add("hidden");
  changeCardsButtonElement.classList.add("hidden");
  getBingoNewNumber();
});
