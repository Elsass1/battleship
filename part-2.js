var readlineSync = require("readline-sync");

const pressedKey = readlineSync.keyIn("Press any key to start the game.");

// grid size

const numberOfShips = 5;

let sizeQuestion = readlineSync.question(
  "What board's size would you like to play on? ie 5 for a 5x5 board. ",
  {
    limit: /[0-9]+/,
    limitMessage: "Wrong input! Enter a number!",
  }
);

let gridSize = +sizeQuestion;

const fleet = [
  {
    id: 1,
    name: "Submarine",
    size: 2,
    orientation: "",
    hits: 0,
    floating: true,
  },
  {
    id: 2,
    name: "Destroyer",
    size: 3,
    orientation: "",
    hits: 0,
    floating: true,
  },
  {
    id: 3,
    name: "Cruiser",
    size: 3,
    orientation: "",
    hits: 0,
    floating: true,
  },
  {
    id: 4,
    name: "Fregate",
    size: 4,
    orientation: "",
    hits: 0,
    floating: true,
  },
  {
    id: 5,
    name: "Aircraft Carrier",
    size: 5,
    orientation: "",
    hits: 0,
    floating: true,
  },
];

function createBoard(size) {
  let board = [];
  let headerRow = [" "];
  for (let column = 1; column <= size; column++) {
    headerRow.push(column < 10 ? ` ${column}` : `${column}`);
  }
  board.push(headerRow);

  for (let row = 1; row <= size; row++) {
    let rowContent = [String.fromCharCode(row + 64) + " "];
    for (let column = 0; column < size; column++) {
      rowContent.push("O");
    }
    board.push(rowContent);
  }
  return board;
}

// work a ship selector
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
      if (board[startRow][startCol + i] !== "O") return false;
    }
  } else {
    if (startRow + shipLength - 1 > numRows) return false;
    for (let i = 0; i < shipLength; i++) {
      if (board[startRow + i][startCol] !== "O") return false;
    }
  }
  return true;
}

function placeShip(board, startRow, startCol, direction, shipLength) {
  for (let i = 0; i < shipLength; i++) {
    if (direction === "horizontal") {
      board[startRow][startCol + i] = "S";
    } else {
      board[startRow + i][startCol] = "S";
    }
  }
}

function placeShipsRandomly(board, fleet) {
  let numRows = board.length - 1;
  let numCols = board[0].length - 1;

  for (let i = 0; i < fleet.length; i++) {
    let shipPlaced = false;
    while (!shipPlaced) {
      let rowIndex = Math.floor(Math.random() * numRows) + 1;
      let colIndex = Math.floor(Math.random() * numCols) + 1;
      let direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      if (
        canPlaceShip(
          board,
          rowIndex,
          colIndex,
          direction,
          fleet[i].size,
          numRows,
          numCols
        )
      ) {
        placeShip(board, rowIndex, colIndex, direction, fleet[i].size);
        shipPlaced = true;
      }
    }
  }
  return board;
}

console.log(createBoard(gridSize));
//shipSelector(fleet);

function printBoard(board) {
  for (let row of board) {
    console.log(row.join(" "));
  }
}

// decide if the ship is placed vertically or horizontally

// verify that there is space

// make sure that the ship is placed within the bounderies of the board

//let board = createBoard(gridSize);
//console.log(board);
//printBoard(board);

// Testing the function
let board = createBoard(gridSize);
console.log("Board before placing ships:");
printBoard(board);

placeShipsRandomly(board, fleet);
console.log("Board after placing ships:");
printBoard(board);
