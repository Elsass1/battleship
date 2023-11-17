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
  },
  {
    id: 2,
    name: "Destroyer",
    size: 3,
    orientation: "",
    hits: 0,
  },
  {
    id: 3,
    name: "Cruiser",
    size: 3,
    orientation: "",
    hits: 0,
  },
  {
    id: 4,
    name: "Fregate",
    size: 4,
    orientation: "",
    hits: 0,
  },
  {
    id: 5,
    name: "Aircraft Carrier",
    size: 5,
    orientation: "",
    hits: 0,
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

function placeShip(board, ship, startRow, startCol) {
  for (let i = 0; i < ship.size; i++) {
    if (ship.orientation === "horizontal") {
      board[startRow][startCol + i] = ship.id;
    } else {
      board[startRow + i][startCol] = ship.id;
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

function playGame(board, fleet) {
  let remainingShips = fleet.length;

  // console.log("Number of ships left: ", remainingShips);

  while (remainingShips > 0) {
    let strike = readlineSync.question("Enter a location to strike ie 'A2': ", {
      limit: /^[A-Ja-j]([0-9]|10)$/,
      limitMessage: "This is not a valid location. Shoot again!",
    });
    // convert from string to array
    let arrayCoordinates = strike.split("");
    let row =
      arrayCoordinates[0].toLocaleUpperCase().charCodeAt(0) -
      "A".charCodeAt(0) +
      1;
    let column = Number(arrayCoordinates[1]);

    // call processStrike with the calculated row and column
    remainingShips = processStrike(board, row, column, remainingShips, fleet);
    if (remainingShips === 0) {
      if (
        readlineSync.keyInYN(
          "You have destroyed all battleships. Would you like to play again? "
        )
      ) {
        return startGame();
      } else {
        console.log("Thanks for playing captain!");
        return;
      }
    }
  }
}

function processStrike(board, row, column, shipCount, fleet) {
  let shipId = board[row][column];
  if (typeof shipId === "number") {
    board[row][column] = "X"; // mark a hit on target
    let hitShip = fleet.find((ship) => ship.id === shipId);
    if (hitShip) {
      hitShip.hits += 1;
      if (hitShip.size === hitShip.hits) {
        shipCount--;
        if (shipCount > 1) {
          console.log(
            `Hit. You have sunk ${hitShip.name}. ${shipCount} ships remaining.`
          );
        } else {
          console.log(
            `Hit. You have sunk ${hitShip.name}. ${shipCount} ship remaining.`
          );
        }
      } else {
        console.log("Hit, but not sunk.");
      }
    }
  } else if (shipId === "O") {
    board[row][column] = "M";
    console.log("You have missed!");
  } else {
    console.log("You have already picked this location. Miss!");
  }
  return shipCount;
}

// Start the game
function startGame() {
  let board = createBoard(gridSize);
  placeShipsRandomly(board, fleet);
  playGame(board, fleet);
}

startGame();
