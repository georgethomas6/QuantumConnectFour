class Turn {
  #purplesTurn = true; // true if it is red's turn, false if it is yellow's turn
  #position = 3; // the position of the piece
  #inHorizontalState = false; // true if the piece is in horizontal state
  #inVerticalState = false; // true if the piece is in vertical state
  #isCertain = true; // true if the piece is certain, false if the piece is not certain
  #turnsTilMeasurement = 0; // if turns til meaasurement is greater than 3 then the piece has been measured
  #column1;
  #column2;
  constructor() {}

  /**
   * @returns #purplesTurn
   */
  get purplesTurn() {
    return this.#purplesTurn;
  }

  /**
   * @returns #position
   */
  get position() {
    return this.#position;
  }

  /**
   * @returns #horizontalState
   */
  get horizontalState() {
    return this.#inHorizontalState;
  }

  /**
   * @returns #verticalState
   */
  get verticalState() {
    return this.#inVerticalState;
  }

  /**
   * @returns #certain
   */
  get certain() {
    return this.#isCertain;
  }

  /**
   * @returns #purplesTurn
   */
  get turnsTilMeasurement() {
    return this.#turnsTilMeasurement;
  }

  /**
   * @returns #column1
   */
  get column1() {
    return this.#column1;
  }

  /**
   * @returns #column2
   */
  get column2() {
    return this.#column2;
  }

  //setters

  /**
   * Initializes column1 to the value of col
   * @param col -> this column to initialize column1 to
   */
  set column1(col) {
    this.#column1 = col;
  }

  /**
   * Initializes column2 to the value of col
   * @param col -> this column to initialize column2 to
   */
  set column2(col) {
    this.#column2 = col;
  }

  /**
   * Changes the state of the move. isCertain -> inVerticalState -> inHorizontalState -> isCertain 
   */
  changeState() {
    if (this.#isCertain){
        this.#isCertain = false;
        this.#inVerticalState = true;
    } else if (this.#inVerticalState){
        this.#inVerticalState = false;
        this.#inHorizontalState = true;
    } else if (this.#inHorizontalState){
        this.#inHorizontalState = false;
        this.#isCertain = true;
    }
  }

  /**
   * Increments the turnsTilMeasure field
   */
  incrementTurnsTilMeasure(){
    this.#turnsTilMeasurement++;
  }

  /**
   * Increments the position
   * @returns void
   */
  incrementPosition() {
    this.#position++;
    if (this.#position > 6) {
      this.#position = 0;
    }
  }

  /**
   * Decrements the position
   * @returns void
   */
  decrementPosition() {
    this.#position--;
    if (this.#position < 0) {
      this.#position = 6;
    }
  }

  /**
   * Sets the value of column1 to the current position if it has not been initialized, otherwise it initializes column2
   * @param column -> the int we want to initialize column1 or column2
   */
  place(column) {
    this.incrementTurnsTilMeasure();
    if (this.#column1 == null) {
      this.#column1 = column;
    } else {
      this.#column2 = column;
    }
  }

}

class Game {
  #board; // A 10 x 7 array of strings, each representing a cell in the board
  #moveInProgress; // the move that is in the process of being made
  constructor() {
    board = initBoard();
    const moveInProgress = new Turn();
  }
}

/**
 * Initializes a 7 x 10 array of strings "XXX"
 */
function initBoard() {
  board = new Array();
  for (let y = 0; y < 7; y++) {
    row = new Array();
    for (let x = 0; x < 11; x++) {
      row("XXX");
    }
    board(row);
  }
}

//GRAPHICS FUNCTIONS ARE BELOW HERE

/**
 * Clears the canvas with a grey background
 */
function clearCanvasGrey() {
  // Get the canvas element
  const canvas = document.getElementById("myCanvas");
  // Get the 2D drawing context
  const ctx = canvas.getContext("2d");
  // Set the fill style to green
  ctx.fillStyle = "grey";
  // Fill the entire canvas with the green color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the rows in the board
 */
function drawRows() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  //9 is the number of columns
  const startWidth = 640 / 9;
  const endWidth = (640 / 9) * 8;
  //draw rows
  for (let i = 5; i < 12; i++) {
    const lineY = (640 / 12) * i;
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(startWidth, lineY);
    ctx.lineTo(endWidth, lineY);
    ctx.fillStyle = "black";
    ctx.stroke();
  }
}

/**
 * Draws the columns in the board
 */
function drawColumns() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  //12 is the number of rows
  const startHeight = (640 / 12) * 5;
  const endHeight = 640 - 640 / 12;

  //draw cols
  for (let i = 1; i < 9; i++) {
    const lineX = (640 / 9) * i;
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(lineX, startHeight);
    ctx.lineTo(lineX, endHeight);
    ctx.fillStyle = "black";
    ctx.stroke();
  }
}

/**
 * Draw the grid lines that form the connect four board
 */
function drawGridLines() {
  drawColumns();
  drawRows();
}

/**
 * Draws a circle the color of the fillColor parameter at the specified X and Y coordinates
 * @param xCord -> xCoordinate of circle location
 * @param yCord -> yCoordinate of circle location
 * @param fillColor -> color of piece, should be only red or yellow
 */
function drawPiece(xCord, yCord, fillColor) {
  const canvas = document.getElementById("myCanvas"); //get the canvas
  const ctx = canvas.getContext("2d");
  const radius = 640 / 30;
  //change the fill and stroke colors
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = fillColor;
  //draw the circle
  ctx.beginPath();
  ctx.arc(xCord, yCord, radius, 0, 2 * Math.PI);
  //draw and fill the circle
  ctx.fill();
  ctx.stroke();

  //reset fill and stroke styles
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
}

/**
 * Draws a piece in vertical state i.e. a piece with a vertical line running through it
 * @param xCord -> xCoordinate of the piece
 * @param yCord -> yCoordinate of the piece
 * @param fillColor -> color of piece, should only be red or yellow
 */
function drawVerticalStatePiece(xCord, yCord, fillColor) {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  //Highest and lowest points on the circle
  const topY = yCord - 640 / 30 - 2;
  const bottomY = yCord + 640 / 30 + 2;
  //draw a piece as normal
  drawPiece(xCord, yCord, fillColor);

  // Draw the vertical line
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(xCord, topY);
  ctx.lineTo(xCord, bottomY);
  ctx.stroke();
}
{
  {
    {
      {
      }
    }
  }
}

/**
 * Draws a piece in horizontal state i.e. a piece with a horizontal line running through it
 * @param xCord -> xCoordinate of the piece
 * @param yCord -> yCoordinate of the piece
 * @param fillColor -> color of piece, should only be red or yellow
 */
function drawHorizontalStatePiece(xCord, yCord, fillColor) {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  //left most and right most points on the circle
  const leftX = xCord - 640 / 30 - 2;
  const rigthX = xCord + 640 / 30 + 2;

  //draw a piece as normal
  drawPiece(xCord, yCord, fillColor);

  // Draw the horizontal line
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(leftX, yCord);
  ctx.lineTo(rigthX, yCord);
  ctx.stroke();
}

/**
 * Initializes a Hashmap that matches state cases to numbers
 */
function initCaseMap() {
  const caseMap = new Map();
  //empty square
  caseMap.set("XXX", 0);
  //full pieces
  caseMap.set("PPP", 1);
  caseMap.set("YYY", 2);
  //pieces in Horizontal state
  caseMap.set("PXX", 3);
  caseMap.set("YXX", 4);
  //pieces in vertical state
  caseMap.set("XXP", 5);
  caseMap.set("XXY", 6);

  return caseMap;
}

/**
 * This function takes string and performs the appropriate drawing on the board. Should only be called in the drawPieces function
 * @param entry -> the string telling us what to draw on the screen
 * @param xCoordinate -> xCoordinate of our drawing
 * @param yCoordinate -> yCoordinate of our drawing
 */
function processEntry(entry, xCoordinate, yCoordinate) {
  const caseMap = initCaseMap();
  const entryCase = caseMap.get(entry);
  switch (entryCase) {
    case 1:
      drawPiece(xCoordinate, yCoordinate, "purple");
      break;
    case 2:
      drawPiece(xCoordinate, yCoordinate, "yellow");
      break;
    case 3:
      drawVerticalStatePiece(xCoordinate, yCoordinate, "purple");
      break;
    case 4:
      drawVerticalStatePiece(xCoordinate, yCoordinate, "yellow");
      break;
    case 5:
      drawHorizontalStatePiece(xCoordinate, yCoordinate, "purple");
      break;
    case 6:
      drawHorizontalStatePiece(xCoordinate, yCoordinate, "yellow");
      break;
    default:
      break;
  }
}

/**
 * Draws the pieces on the board
 * @param board -> the board, must be 10 x 7 array of strings
 */
function drawPieces(board) {
  const cellWidth = 640 / 9;
  const cellHeight = 640 / 12;
  //draw the pieces on the board
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const xCoordinate = cellWidth / 2 + cellWidth * (x + 1);
      const yCoordinate = cellHeight / 2 + cellHeight * (y + 1);

      processEntry(board[y][x], xCoordinate, yCoordinate);
    }
  }
}

const board = [
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXP", "XXX", "PXX", "PXX", "XXX", "XXX"],
  ["YYY", "YXX", "PPP", "YXX", "XXP", "XXX", "XXX"],
];

let move = new Turn();
clearCanvasGrey();
drawGridLines();
drawPieces(board);

const right = document.getElementById("right");
const left = document.getElementById("left");
const state = document.getElementById("state");
const place = document.getElementById("place");
const restart = document.getElementById("restart");

right.addEventListener("click", function (e) {
  move.incrementPosition();
  console.log(move.position);
});

left.addEventListener("click", function (e) {
  move.decrementPosition();
  console.log(move.position);
});

state.addEventListener("click", function (e) {
    move.changeState();
    if (move.certain){
        console.log("Certain");

    } else if (move.verticalState){
        console.log("Vertical State");
    } else if (move.horizontalState){
        console.log("horizontal state");
    }
});

place.addEventListener("click", function (e) {
  if (move.column1 == null) {
    move.place(move.position);
  } else if (move.column2 == null) {
    move.place(move.position);
  }
  console.log(move.column1 + " this is column 1");
  if (move.column2 != null) {
    console.log(move.column2 + " this is column 2");
  }
});

restart.addEventListener("click", function (e) {});
