redPosition = 3;
yellowPosition = 3;
redsTurn = true;

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

clearCanvasGrey();
drawGridLines();
drawPieces(board);

const right = document.getElementById("right");
const left = document.getElementById("left");
const state = document.getElementById("state");
const place = document.getElementById("place");
const restart = document.getElementById("restart");

right.addEventListener("click", function (e) {
  redPosition++;
  if (redPosition > 6) {
    redPosition = 0;
  }
  console.log(redPosition);
});

left.addEventListener("click", function (e) {
  console.log("abigail");
});

state.addEventListener("click", function (e) {});

place.addEventListener("click", function (e) {});

restart.addEventListener("click", function (e) {});
