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
  #typeOfMoves; // this is a string of the type of moves that have been played, consists of V, C, H
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
      let row = [0, 0, 0, 0, 0, 0, 0];
      this.#timeOnBoard.push(row);
    }
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
    this.#gameState = []; // this will be an array of strings
    this.#typeOfMoves = "";
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
   * @returns string
   */
  get typeOfMoves() {
    return this.#typeOfMoves;
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
   * Sets the timeOnBoard to the param.
   * @param {int[][]} timeOnBoard
   */
  set timeOnBoard(timeOnBoard) {
    this.#timeOnBoard = timeOnBoard;
  }

  /**
   * Sets the typeOfMoves to the param.
   * @param {string} typeofMoves
   */
  set typeOfMoves(typeofMoves) {
    this.#typeOfMoves = typeofMoves;
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
   * This function returns two x of pieces to measure i.e. [firstX, secondX]
   * @returns an array of pieces to measure, if there is no piece to measure if returns an empty array
   */
  findPiecesToMeasure() {
    let ret = [];
    for (let y = 9; y > -1; y--) {
      for (let x = 0; x < 7; x++) {
        let pieceShouldBeMeasured = this.#timeOnBoard[y][x] == 3;
        if (pieceShouldBeMeasured) {
          ret.push(x);
        }
      }
    }

    return ret;
  }

  /**
   * Finds the first index in all gameStates in the gameState array where a superposition occured. Should
   * only be called if there is a superposition
   * @returns int index at which the first superposition occured.
   */
  findSuperpositionIndex() {
    for (let i = 0; i < this.#typeOfMoves.length; i++) {
      if (this.#typeOfMoves.charAt(i) != "C") {
        return i;
      }
    }
  }

  /**
   * This function performs a measurement. It finds the pieces on the board that is about to be measured, and filters
   * the gameState after it measures. If there is entanglement it just selects one of the gameStates.
   */
  measure() {
    let piecesToMeasure = this.findPiecesToMeasure();
    if (piecesToMeasure.length == 0) {
      return;
    }

    // TODO RETHIND SHOULD ENTANGLE
    // CANT JUST PICK ONE CUZ THERE COULD BE AN UNINVOLVED SUPERPOSITION
    if (this.shouldEntangle()) {
      let choice = Math.floor(Math.random() * this.#gameState.length);
      let entanglementIndex = 0;
      for (let i = 0; i < this.#typeOfMoves.length; i++){
        if (this.#typeOfMoves.charAt(i) == "C") {
          entanglementIndex++;
        } else {
          break;
        }
      } 

      let chosenCharacterAtEntanglementIndex = this.#gameState[choice].charAt(entanglementIndex);

      this.#gameState = this.#gameState.filter( game => game.charAt(entanglementIndex) == chosenCharacterAtEntanglementIndex);
    
      

      let newTypeOfMoves = "";
      for (let i = 0; i < this.#typeOfMoves.length; i++) {
        if (i <= entanglementIndex + 1){
        newTypeOfMoves = newTypeOfMoves.concat("C");
      } else {
        newTypeOfMoves = newTypeOfMoves.concat(this.#typeOfMoves[i]);
      }

    }
      this.#typeOfMoves = newTypeOfMoves;
      this.gameStateToBoard();

      return;
    }

    let superpositionIndex = this.findSuperpositionIndex();
    let chosen = Math.floor(Math.random() * piecesToMeasure.length);
    let choice = piecesToMeasure[chosen];
    this.#gameState = this.#gameState.filter(
      (game) => game.charAt(superpositionIndex) == choice
    );
    let splitTypeOfMoves = this.#typeOfMoves.split("");
    // Replace the uncertain type with "C" at the index where there is no longer a superposition
    splitTypeOfMoves[superpositionIndex] = "C";

    let newTypeOfMoves = splitTypeOfMoves.join("");
    this.#typeOfMoves = newTypeOfMoves;
    this.gameStateToBoard();
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
   * This function updates the board to reflect the gameState after a measurement has occured.
   */
  gameStateToBoard() {
    let newBoard = [];
    let newTimeOnBoard = [];
    for (let i = 0; i < 10; i++) {
      newBoard.push(["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"]);
      newTimeOnBoard.push([0, 0, 0, 0, 0, 0, 0]);
    }

    let movesPlayed = this.#gameState[0].length;
    let index = 0;

    for (let i = 0; i < movesPlayed; i++) {
      if (this.#typeOfMoves.charAt(index) == "C") {
        let column = this.#gameState[0].charAt(index);
        let row = this.firstOpenRow(newBoard, column);
        if (index % 2 == 0) {
          newBoard[row][column] = "PPP";
        } else {
          newBoard[row][column] = "YYY";
        }
        newTimeOnBoard[row][column] = 4;
      } else if (this.#typeOfMoves.charAt(index) == "H") {
        // Get the possible columns
        let columns = this.getIthCharacter(this.#gameState, index);
        for (let i = 0; i < columns.length; i++) {
          let row = this.firstOpenRow(newBoard, columns[i]);
          if (index % 2 == 0) {
            newBoard[row][columns[i]] = "XXP";
          } else {
            newBoard[row][columns[i]] = "XXY";
          }
          newTimeOnBoard[row][columns[i]] = this.#timeOnBoard[row][columns[i]];
        }
      } else if (this.#typeOfMoves.charAt(index) == "V") {
        let columns = this.getIthCharacter(this.#gameState, index);

        for (let i = 0; i < columns.length; i++) {
          let row = this.firstOpenRow(newBoard, columns[i]);
          if (index % 2 == 0) {
            newBoard[row][columns[i]] = "PXX";
          } else {
            newBoard[row][columns[i]] = "YXX";
          }
          newTimeOnBoard[row][columns[i]] = this.#timeOnBoard[row][columns[i]];
        }
      }
      index++;
    }

    this.#timeOnBoard = newTimeOnBoard;
    this.#board = newBoard;
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
    if (this.shouldEntangle()) {
      let foundEntanglement = this.findEntanglement();
      let entanglementType = this.entangleType(
        foundEntanglement[0],
        foundEntanglement[1],
        foundEntanglement[2]
      );
      this.entangle(entanglementType);
    }
  }

  /**
   * This function finds two entangled pieces on the board. Should only be called if entanglement has been found.
   * @returns an the column entanglement is occuring in, the height of the bottom and top height of the entangled pieces in that order
   */
  findEntanglement() {
    for (let y = 9; y > 0; y--) {
      for (let x = 0; x < 7; x++) {
        let entanglementHappened =
          (this.#board[y][x] == "PXX" && this.#board[y - 1][x] == "XXY") ||
          (this.#board[y][x] == "XXP" && this.#board[y - 1][x] == "YXX") ||
          (this.#board[y][x] == "YXX" && this.#board[y - 1][x] == "XXP") ||
          (this.#board[y][x] == "XXY" && this.#board[y - 1][x] == "PXX");
        if (entanglementHappened) {
          let ret = [];
          ret.push(x);
          ret.push(y);
          ret.push(y - 1);
          return ret;
        }
      }
    }
  }

  /**
   * This function checks to see if entanglement should occur at the places where measurement is equal to 3;
   * @returns true if entanglement should occur, false otherwise
   */
  shouldEntangle() {
    //TODO THINK ABOUT INDEX OUT OF BOUNDS BUG POTENTIAL
    let piecesToMeasureXCoords = this.findPiecesToMeasure();
    if (piecesToMeasureXCoords.length == 0) {
      return;
    }
    let columnOne = piecesToMeasureXCoords[0];
    let columnTwo = piecesToMeasureXCoords[1];
    let piecesToMeasureYCoords = [];
    for (let y = 9; y > 0; y--) {
      if (this.#timeOnBoard[y][piecesToMeasureXCoords[0]] == 3) {
        piecesToMeasureYCoords.push(y);
      }
      if (this.#timeOnBoard[y][piecesToMeasureXCoords[1]]) {
        piecesToMeasureYCoords.push(y);
      }
    }

    let rowOne = piecesToMeasureYCoords[0];
    let rowTwo = piecesToMeasureYCoords[1];

    let firstShouldEntangle =
      (this.#board[rowOne][columnOne] == "PXX" &&
        this.#board[rowOne - 1][columnOne] == "XXY") ||
      (this.#board[rowOne][columnOne] == "XXP" &&
        this.#board[rowOne - 1][columnOne] == "YXX") ||
      (this.#board[rowOne][columnOne] == "YXX" &&
        this.#board[rowOne - 1][columnOne] == "XXP") ||
      (this.#board[rowOne][columnOne] == "XXY" &&
        this.#board[rowOne - 1][columnOne] == "PXX");
    let secondShouldEntangle =
      (this.#board[rowTwo][columnTwo] == "PXX" &&
        this.#board[rowTwo - 1][columnTwo] == "XXY") ||
      (this.#board[rowOne][columnOne] == "XXP" &&
        this.#board[rowTwo - 1][columnTwo] == "YXX") ||
      (this.#board[rowOne][columnOne] == "YXX" &&
        this.#board[rowTwo - 1][columnTwo] == "XXP") ||
      (this.#board[rowOne][columnOne] == "XXY" &&
        this.#board[rowTwo - 1][columnTwo] == "PXX");
    return firstShouldEntangle || secondShouldEntangle;
  }

  /**
   * This function returns A if it is an all or nothing case of entanglement, and B if it is not the all of nothing case. This function
   * should only be called when an instance of entanglement has been found.
   * @param {int} column -> column entanglement occurs in
   * @param {int} upperHeight -> height of the bottom entangled piece
   * @param {int} lowerHeight -> height of the top entangled pice
   * @returns "A" if it is the all or nothing case, B otherwise
   */
  entangleType(column, upperHeight, lowerHeight) {
    let bottomPiece = this.#board[lowerHeight][column];
    let topPiece = this.#board[upperHeight][column];
    let allOrNothingCase =
      (bottomPiece == "PXX" || bottomPiece == "YXX") &&
      (topPiece == "XXP" || topPiece == "XXY");
    //Horiztonal then Vertical
    if (allOrNothingCase) {
      return "A";
    } else {
      return "B";
    }
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
    this.#board[this.firstOpenRow(this.#board, firstPlacement) + 1][
      firstPlacement
    ] = "XXX";

    //Update gameState
    this.updateGameState(firstPlacement, column);
    this.#typeOfMoves = this.#typeOfMoves.concat("V");
    this.gameStateToBoard();
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
    this.#board[this.firstOpenRow(this.#board, firstPlacement) + 1][
      firstPlacement
    ] = "XXX";

    //Update gameState
    this.updateGameState(firstPlacement, column);
    this.#typeOfMoves = this.#typeOfMoves.concat("H");
    this.gameStateToBoard();
    return "done";
  }

  /**
   * Places a certain piece on the board. Should only be called on valid moves
   * @returns "done"
   */
  placeCertainPiece() {
    let column = this.#turnInProgress.column;
    let row = this.firstOpenRow(this.#board, column);
    let color = this.#turnInProgress.color;

    //Update gameState
    this.updateGameState(column, column);
    this.#typeOfMoves = this.#typeOfMoves.concat("C");
    this.gameStateToBoard();
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

  /**
   * Handles a place button click
   */
  reactToPlaceButton() {
    if (this.place() == "done") {
      // Update time on board first because the place functions will set the time on board value for the new piece to 1 and we don't want to accidentally update it to 2
      this.updateTimeOnBoard();
      this.measure();

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
    this.#gameState = [];
    this.#timeOnBoard = [];
    this.#typeOfMoves = "";
    for (let i = 0; i < 10; i++) {
      this.#timeOnBoard.push([0, 0, 0, 0, 0, 0, 0]);
    }
    this.start();
  }
}
