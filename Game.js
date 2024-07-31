// Game.js

//TODO KNOW BUGS
//TODO ABOVE THE BOARD BUG 3.
//TODO ENTANGLEMENT BUG 1. INCLUDES DRAWING ENTANGLEMENT BUG
//TODO IMPLEMENT WIN LOSS 2.
// TODO WALK THROUGH CODE AND CLEAN SLASH CREATE MAP AND COMMENT 4.

import TurnInProgress from "./TurnInProgress.js";
import Graphics from "./Graphics.js";

export default class Game {
  #board; // A 10 x 7 array of strings, each representing a cell in the board
  #turnInProgress; // the move that is in the process of being made
  #gameState;
  #measuringQueue; //An array that we will treat as a queue
  #moveStates; // this is a string of the type of moves that have been played, consists of V, C, H
  #graphics;
  constructor() {
    //initalize blank board
    this.#board = [];
    for (let y = 0; y < 10; y++) {
      let row = ["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"];
      this.#board.push(row);
    }
    this.#measuringQueue = [];
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
    this.#gameState = []; // this will be an array of strings
    this.#moveStates = "";
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
  get gameState() {
    return this.#gameState;
  }

  /**
   * @returns quene
   */
  get measuringQueue() {
    return this.#measuringQueue;
  }
  /**
   * @returns string
   */
  get typeOfMoves() {
    return this.#moveStates;
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

  /**
   * Sets the typeOfMoves to the param.
   * @param {string} typeofMoves
   */
  set typeOfMoves(typeofMoves) {
    this.#moveStates = typeofMoves;
  }

  // GAME FUNCTIONS

  /**
   * Returns a 7 x 10 array of all zeros
   */
  initNewTimeOnBoard() {
    let newTimeOnBoard = [];
    for (let i = 0; i < 10; i++) {
      newTimeOnBoard.push([0, 0, 0, 0, 0, 0, 0]);
    }
    return newTimeOnBoard;
  }

  /**
   * Returns a 7 x 10 array of all "XXX"
   */
  initBlankBoard() {
    let newBoard = [];
    for (let i = 0; i < 10; i++) {
      newBoard.push(["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"]);
    }
    return newBoard;
  }

  /**
   * Increments all of the counters in the measuringQueue
   */
  incrementMeasurementCounts() {
    for (let i = 0; i < this.#measuringQueue.length; i++) {
      this.#measuringQueue[i][0]++;
    }
  }
  /**
   * Finds the first index in all gameStates in the gameState array where a superposition occured. Should
   * only be called if there is a superposition
   * @returns int index at which the first superposition occured.
   */
  findSuperpositionIndex() {
    for (let i = 0; i < this.#moveStates.length; i++) {
      if (this.#moveStates.charAt(i) != "C") {
        return i;
      }
    }
  }

  /**
   * This function performs a measurement. It finds the pieces on the board that is about to be measured, and filters
   * the gameState after it measures. If there is entanglement it just selects one of the gameStates.
   */
  measure() {
    // Make sure the measuring queue is non empty, and the thing at the top of the queue is ready to be measured
    if (this.#measuringQueue.length == 0) {
      return;
    }

    if (this.#measuringQueue[0][0] != 3) {
      return;
    }

    let firstHalfOfSuperPosition = this.#measuringQueue[0][1];
    let secondHalfOfSuperPosition = this.#measuringQueue[0][2];
    let firstX = firstHalfOfSuperPosition[0];
    let secondX = secondHalfOfSuperPosition[0];
    let firstY = firstHalfOfSuperPosition[1];
    let secondY = secondHalfOfSuperPosition[1];

    let isFirstHalfEntangled = this.shouldEntangle(firstX, firstY);
    let isSecondHalfEntangled = this.shouldEntangle(secondX, secondY);

    if (isFirstHalfEntangled) {
      let entanglementType = this.entangleType(firstX, firstY);
      console.log(entanglementType);
      this.#measuringQueue.shift(); // this gets rid of the entry at the top of the measuringQueue
      this.gameStateToBoard();
      return; // make function end before moving on to the code below
    } else if (isSecondHalfEntangled) {
      let entanglementType = this.entangleType(secondX, secondY);
      console.log(entanglementType);
      this.#measuringQueue.shift(); // this gets rid of the entry at the top of the measuringQueue
      this.gameStateToBoard();
      return; // make function end before moving on to the code below
    }

    this.#gameState = this.#gameState.filter(
      (game) =>
        game.charAt(entanglementIndex) == chosenCharacterAtEntanglementIndex
    );

    this.#gameState = this.#gameState.filter(
      (game) => game.charAt(superpositionIndex) == choice
    );

    this.#measuringQueue.shift(); // this gets rid of the entry at the top of the measuringQueue
    this.gameStateToBoard();
  }

  /**
   * Returns true if entanglement should occur, false otherwise
   */
  shouldEntangle(X, Y) {
    if (Y == 0){
      return;
    }
    let bottomPiece = this.#board[Y][X];
    let topPiece = this.#board[Y - 1][X];
    let shouldEntangle =
      (bottomPiece == "PXX" && topPiece == "XXY") ||
      (bottomPiece == "YXX" && topPiece == "XXP") ||
      (bottomPiece == "XXY" && topPiece == "PXX") ||
      (bottomPiece == "XXP" && topPiece == "YXX");
    return shouldEntangle;
  }

  /**
   * This function returns "A" if the case of entanglement is all or nothing. Otherwise it returns "B". Should only be called in measure().
   */
  entangleType(X, Y) {
    let bottomPiece = this.#board[Y][X];
    let topPiece = this.#board[Y - 1][X];
    let allOrNothingCase =
      (bottomPiece == "PXX" || bottomPiece == "YXX") &&
      (topPiece == "XXP" || topPiece == "XXY");

    if (allOrNothingCase) {
      return "A";
    }
    return "B";
  }

  /**
   * Returns an array containing the ith character of each string
   * @param {string[]} gameStates -> an array of gameStates
   * @returns char[] -> an array containing the ith character of each string;
   */
  getIthCharacter(gameStates, i) {
    // Use a Set to store unique characters
    const uniqueChars = new Set();

    // Iterate over each string and add the character at the given index to the Set
    gameStates.forEach((str) => {
      if (str.length > i) {
        uniqueChars.add(str.charAt(i));
      }
    });

    // Convert the Set to an array and return it
    return Array.from(uniqueChars);
  }

  /**
   * Returns an array of the rows at which the pieces will fall
   * @param {string[][]} board -> board to use
   * @param {int[]} columnsPlayedIn -> array of columns played in
   */
  findDepths(board, columnsPlayedIn) {
    let rows = [];
    for (let i = 0; i < columnsPlayedIn.length; i++) {
      let column = columnsPlayedIn[i];
      let row = this.firstOpenRow(board, column);
      rows.push(row);
    }
    return rows;
  }

  /**
   * This function updates the board to reflect the gameState after a measurement has occured.
   */
  gameStateToBoard() {
    let moveStates = this.#moveStates;
    let newBoard = this.initBlankBoard();
    for (let i = 0; i < moveStates.length; i++) {
      switch (
        moveStates.charAt(i) //We want to switch based on the character at the ith position
      ) {
        case "C": // the piece is certain
          let column = this.#gameState[0].charAt(i); // every gameState will have the same character at the ith position since its certain
          let row = this.firstOpenRow(newBoard, column);
          if (i % 2 == 0) {
            newBoard[row][column] = "PPP";
            continue; //kill this iteration
          }
          newBoard[row][column] = "YYY";
          break;
        case "H":
          let columnsPlayedIn = this.getIthCharacter(this.#gameState, i); // the columns played in are all of the ith characters in the gamestates
          let rows1 = this.findDepths(newBoard, columnsPlayedIn);
          for (let col = 0; col < columnsPlayedIn.length; col++) {
            let row = rows1[col];
            let column = columnsPlayedIn[col];
            if (i % 2 == 0) {
              newBoard[row][column] = "PXX";
              continue; //kill this iteration
            }
            newBoard[row][column] = "YXX";
          }
          break;
        case "V":
          let colsPlayedIn2 = this.getIthCharacter(this.#gameState, i); // the columns played in are all of the ith characters in the gamestates
          let rows2 = this.findDepths(newBoard, colsPlayedIn2);
          for (let col = 0; col < colsPlayedIn2.length; col++) {
            let row = rows2[col];
            let column = colsPlayedIn2[col];
            if (i % 2 == 0) {
              newBoard[row][column] = "XXP";
              continue; //kill this iteration
            }
            newBoard[row][column] = "XXY";
          }
          break;
      }
    }
    this.#board = newBoard; // Update Board to reflect gameState
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
    if (gameStateEmpty) {
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

    // TODO ADD ENTANGLEMENT INTO GAMESTATE
  }

  /**
   * This function modifies the current gameState by performing the operators that form our entanglements.  If it is passed "A" it keeps the all or nothing cases
   * of entanglement. If passed "B" it keeps the other cases.
   * @param {string} entanglementType -> the case of entanglement, should only be "A" or "B"
   */
  entangle(entanglementType) {
    switch (entanglementType) {
      case "A":
        this.#gameState = this.#gameState.filter(
          (state) => state.charAt(0) == state.charAt(1)
        ); // This removes all cases that are not all or nothing cases
        break;
      case "B":
        this.#gameState = this.#gameState.filter(
          (state) => state.charAt(0) != state.charAt(1)
        ); // This removes all cases that are not all or nothing cases
        break;
    }
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
    let row = this.firstOpenRow(this.#board, column);
    let state = this.#turnInProgress.state;
    let firstPlacement = this.#turnInProgress.firstPlacement;
    let validClassicMove = state == "certain" && row >= 4;
    let validQuantumMove =
      state != "certain" &&
      row >= 2 &&
      firstPlacement != column &&
      this.#board[4][column] != "PPP" &&
      this.#board[4][column] != "YYY";
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
    this.#board[this.firstOpenRow(this.#board, firstPlacement) + 1][
      firstPlacement
    ] = "XXX";

    let addToMeasureQueue = [];
    let firstHalfOfSuperPosition = [];
    let secondHalfOfSuperPosition = [];
    firstHalfOfSuperPosition.push(firstPlacement);
    secondHalfOfSuperPosition.push(column);

    // Get the heights to add to our entries
    let row1 = this.firstOpenRow(this.#board, firstPlacement);
    let row2 = this.firstOpenRow(this.#board, column);

    firstHalfOfSuperPosition.push(row1); // Add depth of first
    secondHalfOfSuperPosition.push(row2);

    addToMeasureQueue.push([0]); // push the number of turns the piece has been on the board, zero so it will be 1 when we increment
    addToMeasureQueue.push(firstHalfOfSuperPosition); // push the first set of options onto the thing we are adding to measurement queue
    addToMeasureQueue.push(secondHalfOfSuperPosition); // push the second set

    this.#measuringQueue.push(addToMeasureQueue);

    //Update gameState
    this.#moveStates = this.#moveStates.concat("V");
    this.updateGameState(firstPlacement, column);

    return "done";
  }

  printQueue() {
    for (let i = 0; i < this.#measuringQueue.length; i++) {
      for (let t = 0; t < this.measuringQueue[i].length; t++) {
        console.log(`ARRAY AT INDEX ${i}: ${this.#measuringQueue[i][t]}`);
      }
      console.log();
    }
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
    this.#board[this.firstOpenRow(this.#board, firstPlacement) + 1][
      firstPlacement
    ] = "XXX";

    let addToMeasureQueue = [];
    let firstHalfOfSuperPosition = [];
    let secondHalfOfSuperPosition = [];

    // Get the heights to add to our entries
    let row1 = this.firstOpenRow(this.#board, firstPlacement);
    let row2 = this.firstOpenRow(this.#board, column);

    firstHalfOfSuperPosition.push(firstPlacement);
    secondHalfOfSuperPosition.push(column);
    firstHalfOfSuperPosition.push(row1); // Add depth of first
    secondHalfOfSuperPosition.push(row2);

    addToMeasureQueue.push([0]); // push the number of turns the piece has been on the board, zero so that it will be 1 when we increment
    addToMeasureQueue.push(firstHalfOfSuperPosition);
    addToMeasureQueue.push(secondHalfOfSuperPosition);

    this.#measuringQueue.push(addToMeasureQueue);

    //Update gameState

    this.#moveStates = this.#moveStates.concat("H");
    this.updateGameState(firstPlacement, column);
    return "done";
  }

  /**
   * Places a certain piece on the board. Should only be called on valid moves
   * @returns "done"
   */
  placeCertainPiece() {
    let column = this.#turnInProgress.column;

    this.updateGameState(column, column);
    this.#moveStates = this.#moveStates.concat("C");
    return "done";
  }

  /**
   * This function calculates the height at which a turnInProgress should be drawnx
   * @param {int} column -> column we want to find turnInProgressDepth in
   * @return (int) depth
   */
  turnInProgressDepth(column) {
    let firstOpenRow = this.firstOpenRow(this.#board, column);
    let depth = firstOpenRow >= 4 ? 3 : firstOpenRow;
    return depth;
  }

  /**
   * Returns the FIRST open row on the board in the given column.
   * @param board -> the board the find the first open row on
   * @param column -> must be an integer
   * @return (int) column
   */
  firstOpenRow(board, column) {
    let depth = -1;
    for (let y = 0; y < 10; y++) {
      let spotIsEmpty = board[y][column] == "XXX";
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

  printBoard(){
    for (let i = 0; i < this.#board.length; i++ ){
      console.log(this.#board[i]);
    }
  }
  /**
   * Handles a place button click
   */
  reactToPlaceButton() {
    if (this.place() == "done") {
      // Update time on board first because the place functions will set the time on board value for the new piece to 1 and we don't want to accidentally update it to 2

    
      this.gameStateToBoard();
      this.incrementMeasurementCounts();
      this.measure();

      this.printQueue();

      this.changeTurn();
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
    this.#gameState = [];
    this.#moveStates = "";
    this.start();
  }
}
