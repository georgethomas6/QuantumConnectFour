// TODO implement game loop 6.
// TODO implement game state 4.
// TODO debug reactToPlaceButton 3.
// TODO implement measure 5.
// TODO add method to check for ending somewhere so it does the thing

class TurnInProgress {
  #color; // Either purple or yellow
  #column; // where the piece should be drawn by drawTurnInProgress function i.e. where it is prior to being placed
  #state; // either "certain", "vertical" or "horizontal"
  #firstPlacement; // the first vector in the superposition
  #secondPlacement; // the second vector in the superposition
  #canModifyState; // boolean true if the player can still change the state, false if the player has played half a super position

  /**
   * Constructs a TurnInProgress
   * @param {string} color -> color of the piece, should only be "purple" or "yellow"
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
   * Sets the value of firstPlacement to the parameter
   * @param {int} col -> value to set firstPlacement equal to
   */
  set firstPlacement(col) {
    this.#firstPlacement = col;
  }

  /**
   * Sets the value of secondPlacement to the parameter
   * @param {int} col -> to set secondPlacement equal to
   */
  set secondPlacement(col) {
    this.#secondPlacement = col;
  }

  /**
   * Sets the value of the state to the parameter
   * @param {string} state -> value we want to set state to
   */
  set state(state) {
    this.#state = state;
  }

  /**
   * Sets the value of canModifyState to the parameter
   * @param {bool} truthValue->  value we want to set canModifyState to
   */
  set canModifyState(truthValue) {
    this.#canModifyState = truthValue;
  }

  /**
   * Sets the value of column to the parameter
   * @param {int} col -> value we want to set column to
   */
  set column(col) {
    this.#column = col;
  }

  /**
   * Sets the value of color to the parameter
   * @param {string} color -> value we want to set color to
   */
  set color(color) {
    this.#color = color;
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
  #gameState;
  #graphics;
  constructor() {
    //initalize blank board
    this.#board = [];
    for (let y = 0; y < 10; y++) {
      let row = ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"];
      this.#board.push(row);
    }
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
    this.#gameState = []; // this will be an array of strings
  }

  //GETTERS

  /**
   * @return string[][]
   */
  get board() {
    return this.#board;
  }

  /**
   * @return TurnInProgress
   */
  get turnInProgress() {
    return this.#turnInProgress;
  }

  /**
   * Sets the board to the param. For debugging only.
   */
  set board(board) {
    this.#board = board;
  }

  // GAME FUNCTIONS

  /**
   * Checks for an uncertain under the pieces played in a given column
   * @param {int} column -> column to check for uncertain pieces in
   * @param {int} row -> first spot under the piece being checked in a group
   * @returns true if there are no uncertain pieces in the given column, false otherwise
   */
  noProppedPiece(column, row) {
    while (row < 10) {
      let isCertain =
        this.#board[row][column] == "PPP" || this.#board[row][column] == "YYY";
      if (!isCertain) {
        return false;
      }
      row++;
    }
    return true;
  }

  /**
   * This function checks every single column for a group. No need to check for propped pieces here
   * @returns "PPP" if there is a purple group, "YYY" if there is a yellow group, and "XXX" if there is not a group
   */
  checkColumns() {
    for (let y = 9; y > 6; y--) {
      for (let x = 0; x < 7; x++) {
        let state = this.#board[y][x];
        let itsCertain = state == "PPP" || state == "YYY";
        let thereIsAGroup =
          this.#board[y][x] == this.#board[y - 1][x] &&
          this.#board[y][x] == this.#board[y - 2][x] &&
          this.#board[y][x] == this.#board[y - 3][x];
        if (thereIsAGroup && itsCertain) {
          return state;
        }
      }
    }
    return "XXX";
  }

  /**
   * This function checks every single row for a group. In the process it makes sure no member of the group is being propped up by an uncertain piece
   * @returns "PPP" if there is a purple group, "YYY" if there is a yellow group, and "XXX" if there is not a group
   */
  checkRows() {
    for (let y = 9; y > 3; y--) {
      for (let x = 0; x < 4; x++) {
        let state = this.#board[y][x];
        let itsCertain = state == "PPP" || state == "YYY";
        let thereIsAGroup =
          this.#board[y][x] == this.#board[y][x + 1] &&
          this.#board[y][x] == this.#board[y][x + 2] &&
          this.#board[y][x] == this.#board[y][x + 3];
        let noProppedPieces =
          this.noProppedPiece(x, y + 1) &&
          this.noProppedPiece(x + 1, y + 1) &&
          this.noProppedPiece(x + 2, y + 1) &&
          this.noProppedPiece(x + 3, y + 1);
        if (thereIsAGroup && itsCertain && noProppedPieces) {
          return state;
        }
      }
    }
    return "XXX";
  }

  /**
   * Checks for ascending diagonal groups on the board. In the process it checks for propped pieces
   * @returns "PPP" if there is a purple group, "YYY" if there is a yellow group, and "XXX" if there is not a group
   */
  checkAscendingDiagonals() {
    for (let y = 9; y > 6; y--) {
      for (let x = 0; x < 4; x++) {
        let state = this.#board[y][x];
        let itsCertain = state == "PPP" || state == "YYY";
        let thereIsAGroup =
          this.#board[y][x] == this.#board[y - 1][x + 1] &&
          this.#board[y][x] == this.#board[y - 2][x + 2] &&
          this.#board[y][x] == this.#board[y - 3][x + 3];
        let noProppedPieces =
          this.noProppedPiece(x, y + 1) &&
          this.noProppedPiece(x + 1, y) &&
          this.noProppedPiece(x + 2, y - 1) &&
          this.noProppedPiece(x + 3, y - 2);
        if (thereIsAGroup && itsCertain && noProppedPieces) {
          return state;
        }
      }
    }
    return "XXX";
  }

  /**
   * Checks for descending diagonal groups on the board. In the process it checks for propped pieces
   * @returns "PPP" if there is a purple group, "YYY" if there is a yellow group, and "XXX" if there is not a group
   */
  checkDescendingDiagonals() {
    for (let y = 4; y < 7; y++) {
      for (let x = 0; x < 4; x++) {
        let state = this.#board[y][x];
        let itsCertain = state == "PPP" || state == "YYY";
        let thereIsAGroup =
          this.#board[y][x] == this.#board[y + 1][x + 1] &&
          this.#board[y][x] == this.#board[y + 2][x + 2] &&
          this.#board[y][x] == this.#board[y + 3][x + 3];
        let noProppedPieces =
          this.noProppedPiece(x, y + 1) &&
          this.noProppedPiece(x + 1, y + 2) &&
          this.noProppedPiece(x + 2, y + 3) &&
          this.noProppedPiece(x + 3, y + 4);
        if (thereIsAGroup && itsCertain && noProppedPieces) {
          return state;
        }
      }
    }
    return "XXX";
  }

  /**
   * Checks to see if the game has been won
   * @returns "PPP" if purple has won the game, "YYY" if yellow has won the game, "XXX" if there game has not been won
   */
  checkWinner() {
    if (this.checkColumns() != "XXX") {
      return this.checkColumns();
    } else if (this.checkRows() != "XXX") {
      return this.checkRows();
    } else if (this.checkAscendingDiagonals() != "XXX") {
      return this.checkAscendingDiagonals();
    } else if (this.checkDescendingDiagonals() != "XXX") {
      return this.checkDescendingDiagonals();
    }
    return "XXX";
  }

  /**
   * Checks to see if the game has been drawn
   * @returns true if the game has not been drawn, false otherwise
   */
  isGameDrawn() {
    let count = 0;
    for (let y = 9; y > 3; y--) {
      for (let x = 0; x < 7; x++) {
        if (this.#board[y][x] != "XXX") {
          count++;
        }
      }
    }
    return count == 42;
  }

  /**
   * Sets the following variables to these values
   *
   *
   * canModifyState = true
   *
   *
   * column = 3
   *
   *
   * firstPlacement = -1
   *
   *
   * state = "certain"
   *
   *
   * color = opposite of previous
   */
  changeTurn() {
    this.#turnInProgress.canModifyState = true;
    this.#turnInProgress.column = 3;
    this.#turnInProgress.firstPlacement = -1;
    this.#turnInProgress.secondPlacement = -1;
    this.#turnInProgress.state = "certain";
    if (this.#turnInProgress.color == "purple") {
      this.#turnInProgress.color = "yellow";
    } else {
      this.#turnInProgress.color = "purple";
    }
  }

  /**
   * First this function checks to see if the placement is valid. If the placement was valid it places a piece in the correct state on the board
   * @returns "done" if the turn is over, if not it returns "notDone"
   */
  place() {
    let column = this.#turnInProgress.column;
    let row = this.firstOpenRow(column);
    let state = this.#turnInProgress.state;
    let firstPlacement = this.#turnInProgress.firstPlacement;
    let validClassicMove = state == "certain" && row >= 4;
    let validQuantumMove =
      state != "certain" && row >= 2 && firstPlacement != column;
    let isValid = validClassicMove || validQuantumMove;
    if (isValid) {
      if (state == "certain") {
        return this.placeCertainPiece();
      } else if (state == "horizontal") {
        return this.placeHorizontalPiece();
      } else {
        return this.placeVerticalPiece();
      }
    }
    return "notDone";
  }

  /**
   * If a vertical piece has not been placed during the turn, this function temporarily places a vertical piece 
   * at the appropriate location above the board. Otherwise, it gets rid of the temporary piece and drops the pieces 
   * to the correct depths. Should only be called on valid moves
   * @returns "done" if the turn is over, "notDone" otherwise
   */
  placeVerticalPiece() {
    let column = this.#turnInProgress.column;
    let firstPlacement = this.#turnInProgress.firstPlacement;

    if (firstPlacement == -1) {
      // Temporarily put a piece above the board to show where it will fall
      if (this.#turnInProgress.color == "purple") {
        this.#board[this.turnInProgressDepth(column)][column] = "PXX";
      } else {
        this.#board[this.turnInProgressDepth(column)][column] = "YXX";
      }
      this.#turnInProgress.firstPlacement = column;
      this.#turnInProgress.canModifyState = false;
      this.#turnInProgress.column = 3; // reset the column to the middle of the board
      return "notDone";
    }

    // Get rid of temporary piece
    this.#board[this.firstOpenRow(firstPlacement) + 1][firstPlacement] = "XXX";
    let row1 = this.firstOpenRow(firstPlacement);
    let row2 = this.firstOpenRow(column);
    if (this.#turnInProgress.color == "purple") {
      this.#board[row1][firstPlacement] = "PXX";
      this.#board[row2][column] = "PXX";
    } else {
      this.#board[row1][firstPlacement] = "YXX";
      this.#board[row2][column] = "YXX";
    }
    return "done";
  }

  /**
   * If a horizontal piece has not been placed during the turn, this function temporarily places a horizontal piece 
   * at the appropriate location above the board. Otherwise, it gets rid of the temporary piece and drops the pieces 
   * to the correct depths. Should only be called on valid moves
   * @returns "done" if the turn is over, "notDone" otherwise
   */
  placeHorizontalPiece() {
    let column = this.#turnInProgress.column;
    let firstPlacement = this.#turnInProgress.firstPlacement;

    if (firstPlacement == -1) {
      // Temporarily put a piece above the board to show where it will fall
      if (this.#turnInProgress.color == "purple") {
        this.#board[this.turnInProgressDepth(column)][column] = "XXP";
      } else {
        this.#board[this.turnInProgressDepth(column)][column] = "XXY";
      }

      this.#turnInProgress.firstPlacement = column;
      this.#turnInProgress.canModifyState = false;
      this.#turnInProgress.column = 3; // reset the column to the middle of the board
      return "notDone";
    }

    // Get rid of temporary piece
    this.#board[this.firstOpenRow(firstPlacement) + 1][firstPlacement] = "XXX";
    let row1 = this.firstOpenRow(firstPlacement);
    let row2 = this.firstOpenRow(column);
    if (this.#turnInProgress.color == "purple") {
      this.#board[row1][firstPlacement] = "XXP";
      this.#board[row2][column] = "XXP";
    } else {
      this.#board[row1][firstPlacement] = "XXY";
      this.#board[row2][column] = "XXY";
    }
    return "done";
  }

  /**
   * Places a certain piece on the board. Should only be called on valid moves
   * @returns "done"
   */
  placeCertainPiece() {
    let column = this.#turnInProgress.column;
    let row = this.firstOpenRow(column);
    let color = this.#turnInProgress.color;
    if (color == "purple") {
      this.#board[row][column] = "PPP";
    } else {
      this.#board[row][column] = "YYY";
    }
    return "done";
  }

  /**
   * This function calculates the height at which a turnInProgress should be drawnx
   * @param {int} column -> column we want to find turnInProgressDepth in
   * @return (int) depth
   */
  turnInProgressDepth(column) {
    let firstOpenRow = this.firstOpenRow(column);
    let depth = firstOpenRow >= 4 ? 3 : firstOpenRow;
    return depth;
  }

  /**
   * Returns the FIRST open row on the board in the given column.
   * @param column -> must be an integer
   * @return (int) column
   */
  firstOpenRow(column) {
    let depth = -1;
    for (let y = 0; y < 10; y++) {
      let spotIsEmpty = this.#board[y][column] == "XXX";
      if (spotIsEmpty) {
        depth++;
      } else {
        return depth;
      }
    }

    return depth;
  }

  /**
   * Begins the game
   */
  start() {
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(this.#turnInProgress.column),
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a right button click
   */
  reactToRightButton() {
    this.#turnInProgress.incrementPosition();
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(this.#turnInProgress.column),
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a left button click
   */
  reactToLeftButton() {
    this.#turnInProgress.decrementPosition();
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(this.#turnInProgress.column),
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a state button click
   */
  reactToStateButton() {
    let canModifyState = this.#turnInProgress.canModifyState;
    if (canModifyState) {
      this.#turnInProgress.changeState();
    }
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(this.#turnInProgress.column),
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
  }

  /**
   * Handles a place button click
   */
  reactToPlaceButton() {
    if (this.place() == "done") {
      this.changeTurn();
    }

    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(this.#board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(this.#turnInProgress.column),
      this.#turnInProgress.color,
      this.#turnInProgress.state
    );
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

let board = [
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
  ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"],
];

let game = new Game();
game.board = board;
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
