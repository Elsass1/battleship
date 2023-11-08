var readlineSync = require("readline-sync");

const pressedKey = readlineSync.keyIn("Press any key to start the game.");

// grid size

let sizeQuestion = readlineSync.question(
  "What board's size would you like to play on? ie 5 for a 5x5 board. ",
  {
    limit: /[0-9]+/,
    limitMessage: "Wrong input! Enter a number!",
  }
);

let gridSize = +sizeQuestion;

// printing a grid based on the selected number

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
      rowContent.push(".");
    }
    board.push(rowContent);
  }
  return board;
}

console.log(createBoard(gridSize));
