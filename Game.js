// Game.js
import TurnInProgress from "./TurnInProgress.js";
import Graphics from "./Graphics.js";

export default class Game {
  #board; // A 10 x 7 array of strings, each representing a cell in the board
  #turnInProgress; // the move that is in the process of being made
  #gameState;
  #timeOnBoard; // A representation of how long pieces have been on the board;
  #graphics;
  constructor() {
    //initalize blank board
    this.#board = [];
    for (let y = 0; y < 10; y++) {
      let row = ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"];
      this.#board.push(row);
    }
    this.#timeOnBoard = [];
    for (let y = 0; y < 10; y++) {
      let row = ["0", "0", "0", "0", "0", "0", "0"];
      this.#timeOnBoard.push(row);
    }
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
    this.#gameState = []; // this will be an array of strings
  }

  //GETTERS

  /**
   * @returns string[][]
   */
  get board() {
    return this.#board;
  }

  /**
   * @returns TurnInProgress
   */
  get turnInProgress() {
    return this.#turnInProgress;
  }

  /**
   * @returns string[]
   */
  get gameState(){
    return this.#gameState;
  }

  /**
   * Sets the board to the param. For debugging only.
   */
  set board(board) {
    this.#board = board;
  }

  /**
   * Sets the game state to the param.
   * @param {int} state
   */
  set gameState(state) {
    this.#gameState = state;
  }

  // GAME FUNCTIONS

  /**
   * This function updates the timeOnBoard field. If an entry is 0, the function does nothing, if the entry is non-zero, it increments that entry.
   */
  updateTimeOnBoard() {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 7; x++) {
        let needToUpdateEntry = this.#board[y][x] != "XXX";
        // If the piece is certain we will just set its time on board to four, as measure will only measure pieces who have spent exactly 3 turns on the board
        if (this.#board[y][x] == "PPP" || this.#board[y][x] == "YYY") {
          this.#timeOnBoard[y][x] = 4;
        } else if (needToUpdateEntry) {
          this.#timeOnBoard[y][x]++;
        }
      }
    }
  }

  /**
   * This function updates the gameState. It modifies the game state based on the moves it was given. If it
   * is given two different moves it updates behaves like it is responding to a quantum move. If it is given
   * the same move it behaves like it is responding to a certain move.
   * @param {int} firstPlacement
   * @param {int} secondPlacement
   */
  updateGameState(firstPlacement, secondPlacement) {
    let newGameState = [];
    let wasCertainMove = firstPlacement == secondPlacement;
    let gameStateEmpty = this.#gameState.length == 0;
    if (gameStateEmpty){
      if (wasCertainMove) {
        let vectorOne = firstPlacement.toString();
        newGameState.push(vectorOne);
        this.#gameState = newGameState;
      } else {
        let vectorOne = firstPlacement.toString();
        let vectorTwo = secondPlacement.toString();
        newGameState.push(vectorOne);
        newGameState.push(vectorTwo); 
        this.#gameState = newGameState;
      }
      return;
    }

    if (wasCertainMove) {
      for (let i = 0; i < this.#gameState.length; i++) {
        let vectorOne = this.#gameState[i].concat(firstPlacement.toString());
        newGameState.push(vectorOne);
      }
    } else {
      for (let i = 0; i < this.#gameState.length; i++) {
        let vectorOne = this.#gameState[i].concat(firstPlacement.toString());
        let vectorTwo = this.#gameState[i].concat(secondPlacement.toString());
        newGameState.push(vectorOne);
        newGameState.push(vectorTwo);
      }
    }
    this.#gameState = newGameState;
  }

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

    // Make placements on the board
    let row1 = this.firstOpenRow(firstPlacement);
    let row2 = this.firstOpenRow(column);
    if (this.#turnInProgress.color == "purple") {
      this.#board[row1][firstPlacement] = "PXX";
      this.#board[row2][column] = "PXX";
    } else {
      this.#board[row1][firstPlacement] = "YXX";
      this.#board[row2][column] = "YXX";
    }
    //Update gameState
    this.updateGameState(firstPlacement, column);
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
    //Update gameState
    this.updateGameState(firstPlacement, column);
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
    //Update gameState
    this.updateGameState(column, column);
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
      // Update time on board first because the place functions will set the time on board value for the new piece to 1 and we don't want to accidentally update it to 2
      this.updateTimeOnBoard();
      this.changeTurn();
    }

    console.log(" ");
    console.log(this.#gameState);
    console.log(" ");

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
