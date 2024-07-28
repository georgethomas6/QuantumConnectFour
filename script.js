class TurnInProgress {
  #color; // Either purple or yellow
  #column; // where the piece should be drawn by drawTurnInProgress function i.e. where it is prior to being placed
  #state; // either "certain", "vertical" or "horizontal"
  #firstPlacement; // the first vector in the superposition
  #secondPlacement; // the second vector in the superposition
  #canModifyState; // boolean true if the player can still change the state, false if the player has played half a super position

  /**
   * Constructs a TurnInProgress
   * @param  color -> color of the piece, should only be "purple" or "yellow"
   */
  constructor(color) {
    this.#color = color;
    this.#column = 3;
    this.#state = "certain";
    this.#canModifyState = true;
    this.#firstPlacement = -1; // -1 is just a flag to show the first placement has not been made
    this.#secondPlacement = -1;
  }

  //Getters

  /**
   * @return (int) column
   */
  get column() {
    return this.#column;
  }

  /**
   * @return (string) state
   */
  get state() {
    return this.#state;
  }

  /**
   * @return (string) color
   */
  get color() {
    return this.#color;
  }

  /**
   * @return (int) firstPlacement
   */
  get firstPlacement() {
    return this.#firstPlacement;
  }

  /**
   * @return (int) secondPlacement
   */
  get secondPlacement() {
    return this.#secondPlacement;
  }

  /**
   * @return (bool) canModifyState
   */
  get canModifyState() {
    return this.#canModifyState;
  }

  //SETTERS

  /**
   * Sets the value of the firstPlacement to the parameter
   * @param (int) column to set firstPlacement equal to
   */
  set firstPlacement(col) {
    this.#firstPlacement = col;
  }

  /**
   * Sets the value of the secondPlacement to the parameter
   * @param (int) column to set secondPlacement equal to
   */
  set secondPlacement(col) {
    this.#secondPlacement = col;
  }

  /**
   * Sets the value of canModifyState to the parameter
   * @param (bool)
   */
  set canModifyState(truthValue) {
    this.#canModifyState = truthValue;
  }

  //FUNCTIONS

  /**
   * Increments the position of the TurnInProgress. Wraps if the positon is greater than 6
   */
  incrementPosition() {
    this.#column++;
    let needsToWrap = this.#column > 6;
    if (needsToWrap) {
      this.#column = 0;
    }
  }

  /**
   * Decrements the position of the TurnInProgress. Wraps if the positon is less than 0
   */
  decrementPosition() {
    this.#column--;
    let needsToWrap = this.#column < 0;
    if (needsToWrap) {
      this.#column = 6;
    }
  }

  /**
   * Changes the state of the TurnInProgess. certain --> horizontal --> vertical --> certain
   */
  changeState() {
    if (this.#state == "certain") {
      this.#state = "horizontal";
    } else if (this.#state == "horizontal") {
      this.#state = "vertical";
    } else if ((this.#state = "vertical")) {
      this.#state = "certain";
    }
  }
}

class Game {
  #board; // A 10 x 7 array of strings, each representing a cell in the board
  #turnInProgress; // the move that is in the process of being made
  #graphics
  constructor() {
    //initalize blank board
    this.#board = [];
    for (let y = 0; y < 10; y++) {
      let row = ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"];
      this.#board.push(row);
    }
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
  }

  //GETTERS

  /**
   * @return #board
   */
  get board() {
    return this.#board;
  }

  /**
   * @return #moveInProgress
   */
  get turnInProgress() {
    return this.#turnInProgress;
  }

  // GAME FUNCTIONS

  /**
   * This function calculates where the turnInProgress should be drawn above the board
   * @return (int)
   */
  turnInProgressDepth() {
    let firstOpenRow = this.firstOpenRow(this.#turnInProgress.column);
    let depth = firstOpenRow >= 4 ? 3 : firstOpenRow; 
    return depth;
  }
  /**
   * Returns the FIRST open row on the board in the given column.
   * @param column -> must be an integer
   * @return int
   */
  firstOpenRow(column) {
    let depth = -1;
    for (let y = 0; y < 10; y++) {
      let spotIsEmpty = this.#board[y][column] == "XXX";
      if (spotIsEmpty) {
        depth++;
      }
    }

    return depth;
  }

  /**
   * Begins the game
   */
  start(){
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(),
      this.#turnInProgress.firstPlacement,
      this.#turnInProgress.color,
      this.#turnInProgress.state
    )
  }
  /**
   * Handles a right button click.
   */
  reactToRightButton() {
    this.#turnInProgress.incrementPosition();
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPiece(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(),
      this.#turnInProgress.firstPlacement,
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a left button click.
   */
  reactToLeftButton() {
    this.#turnInProgress.decrementPosition();
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPiece(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(),
      this.#turnInProgress.firstPlacement,
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a state button click.
   */
  reactToStateButton() {
    let canModifyState = this.#turnInProgress.canModifyState;
    if (canModifyState) {
      this.#turnInProgress.changeState;
    }
  }

  /**
   * Handles a place button click
   */
  reactToPlaceButton() {
    //TODO
  }

  /**
   * Handles a restart button click
   */
  reactToRestartButton() {
    this.#board = [];
    for (let y = 0; y < 10; y++) {
      let row = ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"];
      this.#board.push(row);
    }
    this.#turnInProgress = new TurnInProgress("purple"); 
    this.start();
  }
}

//GRAPHICS FUNCTIONS ARE BELOW HERE

class Graphics {
  #canvas;
  #ctx;
  #cellWidth = 640 / 9;
  #cellHeight = 640 / 12;

  constructor() {
    this.#canvas = document.getElementById("myCanvas");
    this.#ctx = this.#canvas.getContext("2d");
  }

  /**
   * Clears the canvas with a grey background
   */
  clearCanvasGrey() {
    this.#ctx.fillStyle = "grey";
    // Fill the entire canvas with the green color
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  /**
   * Draws the rows in the board
   */
  drawRows() {
    //9 is the number of columns
    const startWidth = this.#cellWidth;
    const endWidth = this.#cellWidth * 8;
    //draw rows
    for (let i = 5; i < 12; i++) {
      const lineY = (640 / 12) * i;
      this.#ctx.beginPath();
      this.#ctx.lineWidth = 4;
      this.#ctx.moveTo(startWidth, lineY);
      this.#ctx.lineTo(endWidth, lineY);
      this.#ctx.fillStyle = "black";
      this.#ctx.stroke();
    }
  }

  /**
   * Draws the columns in the board
   */
  drawColumns() {
    //12 is the number of rows
    const startHeight = this.#cellHeight * 5;
    const endHeight = 640 - this.#cellHeight;

    //draw cols
    for (let i = 1; i < 9; i++) {
      const lineX = (640 / 9) * i;
      this.#ctx.beginPath();
      this.#ctx.lineWidth = 4;
      this.#ctx.moveTo(lineX, startHeight);
      this.#ctx.lineTo(lineX, endHeight);
      this.#ctx.fillStyle = "black";
      this.#ctx.stroke();
    }
  }

  /**
   * Draw the grid lines that form the connect four board
   */
  drawGridLines() {
    this.drawColumns();
    this.drawRows();
  }

  /**
   * Draws a circle the color of the fillColor parameter at the specified X and Y coordinates
   * @param xCord -> xCoordinate of circle location
   * @param yCord -> yCoordinate of circle location
   * @param fillColor -> color of piece, should be only red or yellow
   */
  drawPiece(xCord, yCord, fillColor) {
    const radius = 640 / 30;
    //change the fill and stroke colors
    this.#ctx.fillStyle = fillColor;
    this.#ctx.strokeStyle = fillColor;
    //draw the circle
    this.#ctx.beginPath();
    this.#ctx.arc(xCord, yCord, radius, 0, 2 * Math.PI);
    //draw and fill the circle
    this.#ctx.fill();
    this.#ctx.stroke();

    //reset fill and stroke styles
    this.#ctx.fillStyle = "black";
    this.#ctx.strokeStyle = "black";
  }

  /**
   * Draws a piece in vertical state i.e. a piece with a vertical line running through it
   * @param xCord -> xCoordinate of the piece
   * @param yCord -> yCoordinate of the piece
   * @param fillColor -> color of piece, should only be red or yellow
   */
  drawVerticalStatePiece(xCord, yCord, fillColor) {
    //Highest and lowest points on the circle
    const topY = yCord - 640 / 30 - 2;
    const bottomY = yCord + 640 / 30 + 2;
    //draw a piece as normal
    this.drawPiece(xCord, yCord, fillColor);

    // Draw the vertical line
    this.#ctx.beginPath();
    this.#ctx.lineWidth = 4;
    this.#ctx.moveTo(xCord, topY);
    this.#ctx.lineTo(xCord, bottomY);
    this.#ctx.stroke();
  }

  /**
   * Draws a piece in horizontal state i.e. a piece with a horizontal line running through it
   * @param xCord -> xCoordinate of the piece
   * @param yCord -> yCoordinate of the piece
   * @param fillColor -> color of piece, should only be red or yellow
   */
  drawHorizontalStatePiece(xCord, yCord, fillColor) {
    //left most and right most points on the circle
    const leftX = xCord - 640 / 30 - 2;
    const rigthX = xCord + 640 / 30 + 2;

    //draw a piece as normal
    this.drawPiece(xCord, yCord, fillColor);

    // Draw the horizontal line
    this.#ctx.beginPath();
    this.#ctx.lineWidth = 4;
    this.#ctx.moveTo(leftX, yCord);
    this.#ctx.lineTo(rigthX, yCord);
    this.#ctx.stroke();
  }
  /**
   * Initializes a Hashmap that matches state cases to numbers
   */
  initCaseMap() {
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
  processEntry(entry, xCoordinate, yCoordinate) {
    const caseMap = this.initCaseMap();
    const entryCase = caseMap.get(entry);
    switch (entryCase) {
      case 1:
        this.drawPiece(xCoordinate, yCoordinate, "purple");
        break;
      case 2:
        this.drawPiece(xCoordinate, yCoordinate, "yellow");
        break;
      case 3:
        this.drawVerticalStatePiece(xCoordinate, yCoordinate, "purple");
        break;
      case 4:
        this.drawVerticalStatePiece(xCoordinate, yCoordinate, "yellow");
        break;
      case 5:
        this.drawHorizontalStatePiece(xCoordinate, yCoordinate, "purple");
        break;
      case 6:
        this.drawHorizontalStatePiece(xCoordinate, yCoordinate, "yellow");
        break;
      default:
        break;
    }
  }

  /**
   * Draws the pieces on the board
   * @param board -> the board, must be 10 x 7 array of strings
   */
  drawPieces(board) {
    //draw the pieces on the board
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const xCoordinate = this.#cellWidth / 2 + this.#cellWidth * (x + 1);
        const yCoordinate = this.#cellHeight / 2 + this.#cellHeight * (y + 1);

        this.processEntry(board[y][x], xCoordinate, yCoordinate);
      }
    }
  }

  /**
   * Draws the turn in progress above the board
   * @param  {int} column -> (int)
   * @param  {int} row -> (int)
   * @param  {int} placement1
   * @param  {string} color -> (string)
   * @param  {string} pieceState -> (string)
   */
  drawTurnInProgress(column, row, placement1, color, pieceState) {
    const xCoordinate = this.#cellWidth / 2 + this.#cellWidth * (column + 1);
    const yCoordinate = this.#cellHeight / 2 + this.#cellHeight * (row + 1);
    if (pieceState == "certain") {
      this.drawPiece(xCoordinate, yCoordinate, color);
    } else if (pieceState == "horizontal") {
      if (placement1 != -1) {
        this.drawHorizontalStatePiece(xCoordinate, yCoordinate, color);
      }
      this.drawHorizontalStatePiece(xCoordinate, yCoordinate, color);
    } else if (pieceState == "vertical") {
      if (placement1 != -1) {
        this.drawVerticalStatePiece(xCoordinate, yCoordinate, color);
      }
      this.drawVerticalStatePiece(xCoordinate, yCoordinate, color);
    }
  }
}

let game = new Game();
game.start();
const right = document.getElementById("right");
const left = document.getElementById("left");
const state = document.getElementById("state");
const place = document.getElementById("place");
const restart = document.getElementById("restart");
const instructions = document.getElementById("instructions");

instructions.addEventListener("click", function (e) {
  window.location.href = "instructions.html";
});

right.addEventListener("click", function (e) {
  game.reactToRightButton();
  
});

left.addEventListener("click", function (e) {
  game.reactToLeftButton();

});

state.addEventListener("click", function (e) {
  game.reactToStateButton();
});

place.addEventListener("click", function (e) {
  game.reactToPlaceButton();
});

restart.addEventListener("click", function (e) {
  game.reactToRestartButton();
});
