
export default class Graphics {
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
   * @param {float} xCoord -> xCoordinate of circle location
   * @param {float} yCoord -> yCoordinate of circle location
   * @param {string} fillColor -> color of piece, should be only "purple" or "yellow"
   */
  drawPiece(xCoord, yCoord, fillColor) {
    const radius = 640 / 30;
    //change the fill and stroke colors
    this.#ctx.fillStyle = fillColor;
    this.#ctx.strokeStyle = fillColor;
    //draw the circle
    this.#ctx.beginPath();
    this.#ctx.arc(xCoord, yCoord, radius, 0, 2 * Math.PI);
    //draw and fill the circle
    this.#ctx.fill();
    this.#ctx.stroke();

    //reset fill and stroke styles
    this.#ctx.fillStyle = "black";
    this.#ctx.strokeStyle = "black";
  }

  /**
   * Draws a piece in vertical state i.e. a piece with a vertical line running through it
   * @param {float} xCoord -> xCoordinate of circle location
   * @param {float} yCoord -> yCoordinate of circle location
   * @param {string} fillColor -> color of piece, should be only "purple" or "yellow"
   */
  drawVerticalStatePiece(xCoord, yCoord, fillColor) {
    //Highest and lowest points on the circle
    const topY = yCoord - 640 / 30 - 2;
    const bottomY = yCoord + 640 / 30 + 2;
    //draw a piece as normal
    this.drawPiece(xCoord, yCoord, fillColor);

    // Draw the vertical line
    this.#ctx.beginPath();
    this.#ctx.lineWidth = 4;
    this.#ctx.moveTo(xCoord, topY);
    this.#ctx.lineTo(xCoord, bottomY);
    this.#ctx.stroke();
  }

  /**
   * Draws a piece in horizontal state i.e. a piece with a horizontal line running through it
   * @param {float} xCoord -> xCoordinate of circle location
   * @param {float} yCoord -> yCoordinate of circle location
   * @param {string} fillColor -> color of piece, should be only "purple" or "yellow"
   */
  drawHorizontalStatePiece(xCoord, yCoord, fillColor) {
    //left most and right most points on the circle
    const leftX = xCoord - 640 / 30 - 2;
    const rigthX = xCoord + 640 / 30 + 2;

    //draw a piece as normal
    this.drawPiece(xCoord, yCoord, fillColor);

    // Draw the horizontal line
    this.#ctx.beginPath();
    this.#ctx.lineWidth = 4;
    this.#ctx.moveTo(leftX, yCoord);
    this.#ctx.lineTo(rigthX, yCoord);
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
   * @param {string} entry -> the string telling us what to draw on the screen
   * @param {float} xCoordinate -> xCoordinate of our drawing
   * @param {float} yCoordinate -> yCoordinate of our drawing
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
        this.drawHorizontalStatePiece(xCoordinate, yCoordinate, "purple");
        break;
      case 4:
        this.drawHorizontalStatePiece(xCoordinate, yCoordinate, "yellow");
        break;
      case 5:
        this.drawVerticalStatePiece(xCoordinate, yCoordinate, "purple");
        break;
      case 6:
        this.drawVerticalStatePiece(xCoordinate, yCoordinate, "yellow");
        break;
      default:
        break;
    }
  }

  /**
   * Draws the pieces on the board
   * @param {string[][]}board -> the board, must be 10 x 7 array of strings
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
   * Draws the turn in progress above the board. Handles drawing all matters concerned with quantum moves in progress
   * @param  {int} column -> column to draw piece in
   * @param  {int} row -> row to draw piece in
   * @param  {string} color -> should only be "purple" or "yellow"
   * @param  {string} pieceState -> should only be "certain", "vertical", or "horizontal"
   */
  drawTurnInProgress(column, row, color, pieceState) {
    const xCoordinate = this.#cellWidth / 2 + this.#cellWidth * (column + 1);

    const yCoordinate = this.#cellHeight / 2 + this.#cellHeight * (row + 1);

    if (pieceState == "certain") {
      this.drawPiece(xCoordinate, yCoordinate, color);
    } else if (pieceState == "horizontal") {
      this.drawHorizontalStatePiece(xCoordinate, yCoordinate, color);
    } else if (pieceState == "vertical") {
      this.drawVerticalStatePiece(xCoordinate, yCoordinate, color);
    }
  }
}
