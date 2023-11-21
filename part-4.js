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
    //    console.log(`Can place ${ship.name}: ${canPlace}`);
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

      tryPlaceEachShip(
        board,
        fleet,
        rowIndex,
        colIndex,
        direction,
        numRows,
        numCols
      );

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
  //  const numberRange = regex.slice(10, 13);

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
      console.log("Current turn: Player");
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
      console.log("Calling processStrike, isPlayer:", isPlayer);

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
      console.log("End of Player's turn");
      isPlayer = false; // This is correct for the player's turn
    } else {
      console.log("Current turn: Computer");
      // for the computer
      const computerStrike = computerCoordinates(regexPattern);
      row = computerStrike[0].charCodeAt(0) - "A".charCodeAt(0);
      column = computerStrike[1];

      // call processStrike with the calculated row and column
      console.log("Calling processStrike, isPlayer:", isPlayer);

      playerRemainingShips = processStrike(
        playerBoard,
        boardGui,
        row,
        column,
        playerRemainingShips,
        playerFleet,
        isPlayer
      );
      printBoard(playerBoard);

      if (playerRemainingShips === 0) {
        console.log("You lost!");
        break;
      }
      console.log("End of Computer's turn");
      isPlayer = true; // This is correct for the computer's turn
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
  console.log("Inside processStrike, isPlayer:", isPlayer);
  let adjustedRow = row * 2 + 2;
  let shipIdInfo = board[adjustedRow][column];
  let shipIdRegex = /\d/;

  let shipHit = false;

  console.log(
    `Processing strike at row: ${row}, column: ${column}, isPlayer: ${isPlayer}`
  );

  // when it's the player's turn to play
  if (isPlayer) {
    console.log("Player's turn to strike.");
    if (shipIdRegex.test(shipIdInfo)) {
      let shipId = parseInt(shipIdInfo.match(/\d+/)[0]);

      console.log(`Player hit a ship at ${row}, ${column}`);

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
      console.log(`Player missed at ${row}, ${column}`);

      board[adjustedRow][column] = "| M";
      boardGui[adjustedRow][column] = "| O";
      console.log("You have missed!");
    } else {
      console.log("You have already picked this location. Miss!");
    }
  } else {
    console.log("Computer's turn to strike.");

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
      console.log(`Computer missed at ${row}, ${column}`);

      board[adjustedRow][column] = "| M";
      // avoids the computer to select a coordinate already struck
    } else if (
      board[adjustedRow][column] === "| M" ||
      board[adjustedRow][column] === "| X"
    ) {
      console.log("Location already picked, picking new coordinates.");
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
      //pick a different coordinate and strike again
    }
  }
  return shipCount;
}

// function processStrike(
//   board,
//   boardGui,
//   row,
//   column,
//   shipCount,
//   fleet,
//   isPlayer
// ) {
//   console.log("Inside processStrike, isPlayer:", isPlayer);
//   let adjustedRow = row * 2 + 2;
//   let shipIdInfo = board[adjustedRow][column];
//   let shipIdRegex = /\d/;

//   let shipHit = false;

//   console.log(
//     `Processing strike at row: ${row}, column: ${column}, isPlayer: ${isPlayer}`
//   );

//   if (isPlayer) {
//     console.log("Player's turn to strike.");
//     if (shipIdRegex.test(shipIdInfo)) {
//       // Player hit a ship
//       let shipId = parseInt(shipIdInfo.match(/\d+/)[0]);

//       console.log(`Player hit a ship at ${row}, ${column}`);

//       board[adjustedRow][column] = "| X";
//       boardGui[adjustedRow][column] = "| X"; // Update the GUI for player hits
//       shipHit = true;

//       let hitShip = fleet.find((ship) => ship.id === shipId);
//       if (hitShip) {
//         hitShip.hits += 1;
//         hitShip.hit = true;
//         if (hitShip.size === hitShip.hits) {
//           shipCount--;
//           hitShip.sunk = true;
//           let article = hitShip.id === 5 ? "an" : "a";
//           let shipNum = shipCount > 1 ? "ships" : "ship";
//           console.log(
//             `Hit. You have sunk ${article} ${hitShip.name}. ${shipCount} ${shipNum} remaining.`
//           );
//         } else {
//           console.log("Hit, but not sunk.");
//         }
//       }
//     } else if (shipIdInfo === "|  ") {
//       // Player missed
//       console.log(`Player missed at ${row}, ${column}`);

//       board[adjustedRow][column] = "| M";
//       boardGui[adjustedRow][column] = "| O"; // Update the GUI for player misses
//       console.log("You have missed!");
//     } else {
//       console.log("You have already picked this location. Miss!");
//     }
//   } else {
//     // Computer's turn to strike.
//     if (shipIdRegex.test(shipIdInfo)) {
//       // Computer hit a ship
//       let shipId = parseInt(shipIdInfo.match(/\d+/)[0]);

//       console.log(`Computer hit a ship at ${row}, ${column}`);

//       board[adjustedRow][column] = "| X";
//       shipHit = true;

//       let hitShip = fleet.find((ship) => ship.id === shipId);
//       if (hitShip) {
//         hitShip.hits += 1;
//         hitShip.hit = true;
//         if (hitShip.size === hitShip.hits) {
//           shipCount--;
//           hitShip.sunk = true;
//         }
//       }
//     } else if (shipIdInfo === "|  ") {
//       // Computer missed
//       console.log(`Computer missed at ${row}, ${column}`);
//     }
//   }
//   return shipCount;
// }

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

// the computer number coordinate should be dynamic
