var readlineSync = require("readline-sync");

const pressedKey = readlineSync.keyIn("Press any key to start the game.");

// number of ships for each player
const numberOfShips = 5;

let sizeQuestion = readlineSync.question(
  "What board's size would you like to play on? ie 5 for a 5x5 board. ",
  {
    limit: /[0-9]+/,
    limitMessage: "Wrong input! Enter a number!",
  }
);

// convert string to number
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
  // initialising an empty array to represent the board
  let board = [];

  // create header row with column numbers
  let headerRow = ["   "]; // initial spacing
  // looping through each column
  for (let column = 1; column <= size; column++) {
    //if column is < 10, adds an additional space for alignment
    headerRow.push(`${column < 10 ? " " : " "}${column} `);
  }
  board.push(headerRow);

  // create a row for separating the header from the grid
  let lineRow = ["   "];
  // looping through the size of the board to create & push the row separator ---
  for (let column = 0; column < size; column++) {
    lineRow.push("---");
  }
  board.push(lineRow);

  // create each row of the board
  for (let row = 1; row <= size; row++) {
    // convert row number to its corresponding letter label (1 becomes a)
    let rowLabel = String.fromCharCode(row + 64);
    // unitialize the row with the row label
    let rowContent = [rowLabel + " "];

    // fill the row with cells
    for (let column = 0; column < size; column++) {
      // for the GUI board
      if (isGui) {
        rowContent.push("|  ");
        // for the other boards (player & computer)
      } else {
        rowContent.push("|  ");
      }
    }
    // for the end of the board (left size)
    rowContent.push("|");
    board.push(rowContent);

    // adds a sepator line after each row
    let lineRow = ["   "];
    for (let column = 0; column < size; column++) {
      lineRow.push("---");
    }
    board.push(lineRow);
  }
  return board;
}

// check if a ship can be placed at designated position
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
    // check that the ship does not go over the board limits
    if (startCol + shipLength - 1 > numCols) return false;
    // check that no other ship is present
    for (let i = 0; i < shipLength; i++) {
      if (board[startRow][startCol + i] !== "|  ") return false;
    }
  } else {
    if (startRow + shipLength - 1 > numRows) return false;
    for (let i = 0; i < shipLength; i++) {
      if (board[startRow + i][startCol] !== "|  ") return false;
    }
  }
  // return true if no overlapping & ship does not go over the board limits
  return true;
}

// place a ship on the board
function placeShip(board, ship, startRow, startCol) {
  for (let i = 0; i < ship.size; i++) {
    if (ship.orientation === "horizontal") {
      // place ship horizontally by filling consecutive columns
      board[startRow][startCol + i] = "| " + ship.id;
    } else {
      // place ship vertically by filling consecutive rows
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

      // check if the ship can be placed
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
        // places the ship if canPlaceShip returns true
        placeShip(board, ship, rowIndex, colIndex);
        // marks the ship as placed
        shipPlaced = true;
      }
      // if canPlaceShip returns false, the while loop continues with new random positions.
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

  const minChar = letterRange.charCodeAt(0);
  const maxChar = letterRange.charCodeAt(2);

  // generating a random value for n based on the size of the grid
  const minNum = 1;
  const maxNum = maxChar - minChar + 1;
  const n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

  const randomNum = Math.floor(Math.random() * n) + 1;

  const randomCharCode =
    Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar;
  return [String.fromCharCode(randomCharCode), randomNum];
}

const regexPattern = createRegexPattern(gridSize);

function playGame(
  playerBoard,
  computerBoard,
  boardGui,
  playerFleet,
  computerFleet
) {
  let playerRemainingShips = playerFleet.length;
  let computerRemainingShips = computerFleet.length;
  let isPlayer = true;

  while (playerRemainingShips > 0 && computerRemainingShips > 0) {
    if (isPlayer) {
      let strike = readlineSync.question(
        "Enter a location to strike ie 'A2': ",
        {
          limit: /^[A-Ja-j]([0-9]|10)$/,
          limitMessage: "This is not a valid location. Shoot again!",
        }
      );
      // convert from string to array
      let arrayCoordinates = strike.split("");
      let row =
        arrayCoordinates[0].toLocaleUpperCase().charCodeAt(0) -
        "A".charCodeAt(0);
      let column = parseInt(arrayCoordinates.slice(1).join(""));

      // call processStrike with the calculated row and column

      computerRemainingShips = processStrike(
        computerBoard,
        boardGui,
        row,
        column,
        computerRemainingShips,
        computerFleet,
        isPlayer
      );

      printBoard(boardGui);

      if (computerRemainingShips === 0) {
        console.log("Congratulations captain! You won the battle!");
        break;
      }

      isPlayer = false;
    } else {
      // for the computer
      const computerStrike = computerCoordinates(regexPattern);
      row = computerStrike[0].charCodeAt(0) - "A".charCodeAt(0);
      column = computerStrike[1];

      // call processStrike with the calculated row and column

      playerRemainingShips = processStrike(
        playerBoard,
        boardGui,
        row,
        column,
        playerRemainingShips,
        playerFleet,
        isPlayer
      );

      if (playerRemainingShips === 0) {
        console.log("You lost!");
        break;
      }

      isPlayer = true;
    }
  }

  if (readlineSync.keyInYN("Would you like to play again? ")) {
    startGame();
  } else {
    console.log("Thanks for playing captain!");
  }
}

function processStrike(
  board,
  boardGui,
  row,
  column,
  shipCount,
  fleet,
  isPlayer
) {
  let adjustedRow = row * 2 + 2;
  let shipIdInfo = board[adjustedRow][column];
  let shipIdRegex = /\d/;

  let shipHit = false;

  // when it's the player's turn to play
  if (isPlayer) {
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
  } else {
    // when it's the computer turn to play
    if (shipIdRegex.test(shipIdInfo)) {
      console.log(`Computer hit a ship at ${row}, ${column}`);

      let shipId = parseInt(shipIdInfo.match(/\d+/)[0]);
      board[adjustedRow][column] = "| X";
      shipHit = true;

      let hitShip = fleet.find((ship) => ship.id === shipId);
      if (hitShip) {
        hitShip.hits += 1;
        hitShip.hit = true;
        if (hitShip.size === hitShip.hits) {
          shipCount--;
          hitShip.sunk = true;
          console.log("player remaining ships:", shipCount);
        }
      }
    } else if (shipIdInfo === "|  ") {
      board[adjustedRow][column] = "| M";
      // avoids the computer to select a coordinate already struck
    } else if (
      board[adjustedRow][column] === "| M" ||
      board[adjustedRow][column] === "| X"
    ) {
      const computerStrike = computerCoordinates(regexPattern);
      row = computerStrike[0].charCodeAt(0) - "A".charCodeAt(0);
      column = computerStrike[1];
      return processStrike(
        board,
        boardGui,
        row,
        column,
        shipCount,
        fleet,
        isPlayer
      );
    }
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
  printBoard(boardGui);
  playGame(playerBoard, computerBoard, boardGui, playerFleet, computerFleet);
}

startGame();
