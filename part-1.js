var readlineSync = require("readline-sync");
const pressedKey = readlineSync.keyIn("Press any key to start the game.");

const numberOfShips = 2;

// creates the board
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

function placeShipsRandomly(board, numberOfShips) {
  let placedShips = 0;
  // avoiding placing within the first row (which is a label)
  let size = board.length - 1;
  while (placedShips < numberOfShips) {
    let rowIndex = Math.floor(Math.random() * size) + 1;
    let columnIndex = Math.floor(Math.random() * size) + 1;
    if (board[rowIndex][columnIndex] === "O") {
      board[rowIndex][columnIndex] = "S";
      placedShips++;
    }
  }
}

function playGame(board) {
  let remainingShips = numberOfShips;
  while (remainingShips > 0) {
    let strike = readlineSync.question("Enter a location to strike ie 'A2': ", {
      limit: /^[A-Ca-c][1-3]$/,
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
    remainingShips = processStrike(board, row, column, remainingShips);
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

function processStrike(board, row, column, shipCount) {
  let coordinates = board[row][column];
  if (coordinates === "S") {
    board[row][column] = "X"; // mark a hit on target
    shipCount--;
    console.log(
      `Hit. You have sunk a battleship. ${shipCount} ship remaining.`
    );
  } else if (coordinates === "O") {
    board[row][column] = "M";
    console.log("You have missed!");
  } else {
    console.log("You have already picked this location. Miss!");
  }
  return shipCount;
}

// prints the board
function printBoard(board) {
  for (let row of board) {
    console.log(row.join(" "));
  }
}

// Start the game
function startGame() {
  let board = createBoard(3);
  placeShipsRandomly(board, numberOfShips);
  printBoard(board);
  playGame(board);
}

startGame();
