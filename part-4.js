var readlineSync = require("readline-sync");

const pressedKey = readlineSync.keyIn("Press any key to start the game.");

const numberOfShips = 5;

let sizeQuestion = readlineSync.question(
  "What board's size would you like to play on? ie 5 for a 5x5 board. ",
  {
    limit: /[0-9]+/,
    limitMessage: "Wrong input! Enter a number!",
  }
);

let gridSize = +sizeQuestion;

const playerFleet = [
  {
    id: 1,
    name: "submarine",
    size: 2,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 2,
    name: "destroyer",
    size: 3,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 3,
    name: "cruiser",
    size: 3,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 4,
    name: "fregate",
    size: 4,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 5,
    name: "aircraft carrier",
    size: 5,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
];

const computerFleet = [
  {
    id: 1,
    name: "submarine",
    size: 2,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 2,
    name: "destroyer",
    size: 3,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 3,
    name: "cruiser",
    size: 3,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 4,
    name: "fregate",
    size: 4,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
  {
    id: 5,
    name: "aircraft carrier",
    size: 5,
    orientation: "",
    hits: 0,
    hit: false,
    sunk: false,
  },
];

function createBoard(size, isGui = false, computer = false) {
  let board = [];

  // create header row with column numbers
  let headerRow = ["   "];
  for (let column = 1; column <= size; column++) {
    headerRow.push(`${column < 10 ? " " : " "}${column} `);
  }
  board.push(headerRow);

  let lineRow = ["   "];
  for (let column = 0; column < size; column++) {
    lineRow.push("---");
  }
  board.push(lineRow);

  // create each row
  for (let row = 1; row <= size; row++) {
    let rowLabel = String.fromCharCode(row + 64);
    let rowContent = [rowLabel + " "];

    // fill the row with cells
    for (let column = 0; column < size; column++) {
      if (isGui) {
        rowContent.push("|  ");
      } else {
        rowContent.push("|  ");
      }
    }
    rowContent.push("|");
    board.push(rowContent);

    let lineRow = ["   "];
    for (let column = 0; column < size; column++) {
      lineRow.push("---");
    }
    board.push(lineRow);
  }
  return board;
}

function tryPlaceEachShip(
  board,
  fleet,
  startRow,
  startCol,
  direction,
  numRows,
  numCols
) {
  fleet.forEach((ship) => {
    const canPlace = canPlaceShip(
      board,
      startRow,
      startCol,
      direction,
      ship.size,
      numRows,
      numCols
    );
    console.log(`Can place ${ship.name}: ${canPlace}`);
  });
}

function canPlaceShip(
  board,
  startRow,
  startCol,
  direction,
  shipLength,
  numRows,
  numCols
) {
  if (direction === "horizontal") {
    if (startCol + shipLength - 1 > numCols) return false;
    for (let i = 0; i < shipLength; i++) {
      if (board[startRow][startCol + i] !== "|  ") return false;
    }
  } else {
    if (startRow + shipLength - 1 > numRows) return false;
    for (let i = 0; i < shipLength; i++) {
      if (board[startRow + i][startCol] !== "|  ") return false;
    }
  }
  return true;
}

function placeShip(board, ship, startRow, startCol) {
  for (let i = 0; i < ship.size; i++) {
    if (ship.orientation === "horizontal") {
      board[startRow][startCol + i] = "| " + ship.id;
    } else {
      board[startRow + i][startCol] = "| " + ship.id;
    }
  }
}

function placeShipsRandomly(board, fleet) {
  let numRows = board.length - 1;
  let numCols = board[0].length - 1;

  fleet.forEach((ship) => {
    let shipPlaced = false;
    while (!shipPlaced) {
      let rowIndex = Math.floor(Math.random() * numRows) + 1;
      let colIndex = Math.floor(Math.random() * numCols) + 1;
      let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      ship.orientation = direction;

      tryPlaceEachShip =
        (board, fleet, rowIndex, colIndex, direction, numRows, numCols);

      if (
        canPlaceShip(
          board,
          rowIndex,
          colIndex,
          direction,
          ship.size,
          numRows,
          numCols
        )
      ) {
        placeShip(board, ship, rowIndex, colIndex);
        shipPlaced = true;
      }
    }
  });
}

function numberToLetter(n) {
  return String.fromCharCode("A".charCodeAt(0) + n - 1);
}

function createRegexPattern(n) {
  const letter = numberToLetter(n);
  return `[A-${letter}](10|[0-9])`;
}

function computerCoordinates(regex) {
  const letterRange = regex.slice(1, 4);
  const numberRange = regex.slice(10, 13);

  const minChar = letterRange.charCodeAt(0);
  const maxChar = letterRange.charCodeAt(2);

  const randomNum = Math.floor(Math.random() * 10) + 1;

  const randomCharCode =
    Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar;
  return [String.fromCharCode(randomCharCode), randomNum];
}

// // generates a stike coordinate for the computer
// function computerCoordinates(computerStrike) {
//   console.log("this is the random coordinate:", computerStrike);
//   let computerRow = computerStrike[0].charCodeAt(0) - "A".charCodeAt(0);
//   let computerCol = computerStrike[1];
//   console.log("computer row:", computerRow);
//   console.log("computer column:", computerCol);
// }

const regexPattern = createRegexPattern(gridSize);

//computerCoordinates(computerStrike);

function playGame(
  playerBoard,
  computerBoard,
  boardGui,
  playerFleet,
  computerFleet
) {
  let playerRemainingShips = playerFleet.length;
  let computerRemaingShips = computerFleet.length;

  while (playerRemainingShips > 0 && computerRemaingShips > 0) {
    let strike = readlineSync.question("Enter a location to strike ie 'A2': ", {
      limit: /^[A-Ja-j]([0-9]|10)$/,
      limitMessage: "This is not a valid location. Shoot again!",
    });
    // convert from string to array
    let arrayCoordinates = strike.split("");
    let row =
      arrayCoordinates[0].toLocaleUpperCase().charCodeAt(0) - "A".charCodeAt(0);
    let column = parseInt(arrayCoordinates.slice(1).join(""));

    // call processStrike with the calculated row and column
    playerRemainingShips = processStrike(
      computerBoard,
      boardGui,
      row,
      column,
      playerRemainingShips,
      computerFleet
    );

    printBoard(boardGui);

    if (computerRemaingShips === 0) {
      console.log("Congratulations captain! You won the battle!");
      break;
    }

    // for the computer
    const computerStrike = computerCoordinates(regexPattern);
    row = computerStrike[0].charCodeAt(0) - "A".charCodeAt(0);
    column = computerStrike[1];

    // call processStrike with the calculated row and column
    computerRemaingShips = processStrike(
      playerBoard,
      boardGui,
      row,
      column,
      computerRemaingShips,
      playerFleet
    );

    printBoard(playerBoard);

    if (playerRemainingShips === 0) {
      console.log("You lost!");
      break;
    }
  }

  if (readlineSync.keyInYN("Would you like to play again? ")) {
    startGame();
  } else {
    console.log("Thanks for playing captain!");
  }
}

function processStrike(board, boardGui, row, column, shipCount, fleet) {
  let adjustedRow = row * 2 + 2;
  let shipIdInfo = board[adjustedRow][column];
  let shipIdRegex = /\d/;

  let shipHit = false;

  if (shipIdRegex.test(shipIdInfo)) {
    let shipId = parseInt(shipIdInfo.match(/\d+/)[0]);
    board[adjustedRow][column] = "| X";
    boardGui[adjustedRow][column] = "| X";
    shipHit = true;

    let hitShip = fleet.find((ship) => ship.id === shipId);
    if (hitShip) {
      hitShip.hits += 1;
      hitShip.hit = true;
      if (hitShip.size === hitShip.hits) {
        shipCount--;
        hitShip.sunk = true;
        let article = hitShip.id === 5 ? "an" : "a";
        let shipNum = shipCount > 1 ? "ships" : "ship";
        console.log(
          `Hit. You have sunk ${article} ${hitShip.name}. ${shipCount} ${shipNum} remaining.`
        );
      } else {
        console.log("Hit, but not sunk.");
      }
    }
  } else if (shipIdInfo === "|  ") {
    board[adjustedRow][column] = "| M";
    boardGui[adjustedRow][column] = "| O";
    console.log("You have missed!");
  } else {
    console.log("You have already picked this location. Miss!");
  }
  return shipCount;
}

function printBoard(board) {
  for (let row of board) {
    console.log(row.join(" "));
  }
}

function startGame() {
  let playerBoard = createBoard(gridSize);
  let boardGui = createBoard(gridSize, true);
  let computerBoard = createBoard(gridSize, true);

  placeShipsRandomly(playerBoard, playerFleet);
  placeShipsRandomly(computerBoard, computerFleet);
  printBoard(playerBoard);
  console.log("This is the GUI board");
  printBoard(boardGui);
  console.log("This is the computer board");
  printBoard(computerBoard);
  playGame(playerBoard, computerBoard, boardGui, playerFleet, computerFleet);
}

startGame();

// use computerCoordinates() in processStrike() to generate the strikes of the computer
