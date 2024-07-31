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
  #timeOnBoard; // A 10 X 7 board that keeps track of the amount of time a moved has been in a position
  #moveStates; // this is a string of the type of moves that have been played, consists of V, C, H
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
    this.timeOnBoard = this.initNewTimeOnBoard();
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

  get timeOnBoard() {
    return this.#timeOnBoard;
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

  set timeOnBoard(newTime) {
    this.#timeOnBoard = newTime;
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
   * Returns the position of entangled pieces in an array.
   * @return [x1, y1, x2, y2, x3, y3, x4, y4]
   */
  entanglementIsHappeningHere(firstPlacement, secondPlacement) {
    let returnValue = [];
    let entanglementOccuring = this.doWeNeedToEntangle(
      firstPlacement,
      secondPlacement
    ); // FIND FIRST INSTANCE OF ENTANGLEMENT TO FIND TARGETS
    let firstPieceToLookForX = entanglementOccuring[0];
    let firstPieceToLookForY = entanglementOccuring[1];
    let secondPieceToLookForX = entanglementOccuring[0];
    let secondPieceToLookForY = entanglementOccuring[1] + 1;
    let firstPieceToLookFor =
      this.#board[firstPieceToLookForY][firstPieceToLookForX]; // SAVE TARGET 1
    let secondPieceToLookFor =
      this.#board[secondPieceToLookForY][secondPieceToLookForX]; // SAVE TARGET 2

    // ENTANGLEMENT IS OCCURINIG HERE SO PUSH THESE PIECES TO RETURN VALUE
    returnValue.push(firstPieceToLookForX);
    returnValue.push(firstPieceToLookForY);
    returnValue.push(secondPieceToLookForX);
    returnValue.push(secondPieceToLookForY);

    // NOW WE NEED TO FIND THE LOWEST PIECES THAT MATCH THEIR STRING ON THE BOARD NOT IN THE SAME COLUMN
    for (let y = 9; y > 0; y--) {
      for (let x = 0; x < 7; x++) {
        if (x == firstPieceToLookForX) {
          continue; // WE DO NOT WANT TO SEARCH THE COLUMN WE ALREADY KNOW ENTANGLEMENT IS HAPPENING IN
        } else if (
          this.#board[y][x] == firstPieceToLookFor ||
          this.#board[y][x] == secondPieceToLookFor
        ) {
          returnValue.push(x);
          returnValue.push(y);
        }
      }
    }

    return returnValue;
  }

  /**
   * This function finds the current time of the piece that is not involved in the entanglment. It requires the position of every piece involved in the superposition.
   * @returns number between 1-3 or 0
   */
  findTimeOfNonEntangledPiece(x1, y1, x2, y2, x3, y3, x4, y4) {
    for (let y = 9; y > 0; y--) {
      for (let x = 0; x < 7; x++) {
        let positionIsInvolvedInEntanglement =
          (x == x1 && y == y1) ||
          (x == x2 && y == y2) ||
          (x == x3 && y == y3) ||
          (x == x4 && y == y4);
        if (positionIsInvolvedInEntanglement) {
          continue; // WE DONT WANT THE TIME OF ANYONE WHO IS ENTANGLED
        }
        let positionIsInSuperPosition =
          this.#board[y][x] != "XXX" &&
          this.#board[y][x] != "PPP" &&
          this.#board[y][x] != "YYY";
        if (positionIsInSuperPosition) {
          return this.#timeOnBoard[y][x];
        }
      }
    }

    return 0;
  }

  /**
   * Returns "A" if it is an all or nothing case, "B" otherwise
   * @param {int} column -> entanglement is occuring in
   * @param {int} -> row first height in the entanglement
   */
  findEntanglementType(column, row) {
    if (row == 9) {
      return; // AVOID INDEX OUT OF BOUNDS
    }
    let topPiece = this.#board[row][column];
    let bottomPiece = this.#board[row + 1][column];
    if (
      (bottomPiece == "PXX" && topPiece == "XXY") ||
      (bottomPiece == "YXX" && topPiece == "XXP")
    ) {
      return "A";
    } else {
      return "B";
    }
  }
  /**
   * This function performs a measurement. It finds the pieces on the board that is about to be measured, and filters
   * the gameState after it measures. If there is entanglement it just selects one of the gameStates.
   */
  measure() {
    let piecesToBeMeasured = this.findPiecesToMeasure();
    if (piecesToBeMeasured.length == 0) {
      return; // If there is nothing to measure return.
    }

    // TODO FILTER BASED ON COLUMN CHOICE OF SUPER POSITION
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
    console.log("UPDATING  GAME STATE");
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
      return; // IF THE GAME STATE IS EMPTY WE DO NOT WANT TO CHECK FOR ENTANGLEMENT
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

    //UPDATE GAME STATE
    // FILTER IF ENTANGLEMENT

    this.#gameState = newGameState;
    console.log("THIS IS GAME STATE " + this.#gameState);
  }

  handleEntanglement(firstPlacement, secondPlacement) {
    let isEntanglementOccuring = this.doWeNeedToEntangle(
      firstPlacement,
      secondPlacement
    ); // THIS IS THE FIRST POSITION OF THE ENTANGLEMENT
    console.log("THIS WHERE ENTANGLEMENT IS HAPPENING BELOW ");
    console.log(isEntanglementOccuring);
    if (isEntanglementOccuring.length != 0) {
      let entanglementIsHappeningHere = this.entanglementIsHappeningHere(
        firstPlacement,
        secondPlacement
      ); // THIS IS ALL OF THE POSITIONS IN THE ENTANGLEMENT
      console.log(
        "ENTANGLEMENT IS OCCURING IN THESE PIECES  " +
          entanglementIsHappeningHere
      );
      // ARGUEMENTS TO PASS TO findTimeOfNonEntangledPiece;
      let x1 = entanglementIsHappeningHere[0];
      let y1 = entanglementIsHappeningHere[1];
      let x2 = entanglementIsHappeningHere[2];
      let y2 = entanglementIsHappeningHere[3];
      let x3 = entanglementIsHappeningHere[4];
      let y3 = entanglementIsHappeningHere[5];
      let x4 = entanglementIsHappeningHere[6];
      let y4 = entanglementIsHappeningHere[7];
      let findTimeOfNonEntangledPiece = this.findTimeOfNonEntangledPiece();
      let entanglementType = this.findEntanglementType(
        isEntanglementOccuring[0],
        isEntanglementOccuring[1]
      );
      console.log(
        "TIME OF NON ENTANGLED PIECE " +
          this.findTimeOfNonEntangledPiece(x1, y1, x2, y2, x3, y3, x4, y4)
      );
      console.log(
        "THIS IS THE ENTANGLEMENT TYPE " +
          this.findEntanglementType(
            entanglementIsHappeningHere[0],
            entanglementIsHappeningHere[1]
          )
      );
      let choice = this.getRandomIntInclusiveExclusive(0, 2);
      let chosenColumn = choice == 0 ? firstPlacement : secondPlacement;
      let superpositionIndex = this.#gameState[0].length - 1; // length - 1 because of zero indexing
      console.log("THIS IS THE CHOSEN COLUMN: " + chosenColumn);
      console.log(superpositionIndex);
      if (entanglementType == "A") {
        this.#gameState = this.#gameState.filter(
          (game) =>
            (game.charAt(superpositionIndex) == chosenColumn &&
              game.charAt(superpositionIndex - 1) == chosenColumn) || // THIS IS THE ALL CASE
            (game.charAt(superpositionIndex) != chosenColumn &&
              game.charAt(superpositionIndex - 1) != chosenColumn) // THIS IS THE NOTHING CASE
        );
      } else {
        this.#gameState = this.#gameState.filter(
          (game) =>
            !(
              (game.charAt(superpositionIndex) == chosenColumn &&
                game.charAt(superpositionIndex - 1) == chosenColumn) || // THIS IS THE ALL CASE
              (game.charAt(superpositionIndex) != chosenColumn &&
                game.charAt(superpositionIndex - 1) != chosenColumn)
            ) // THIS IS THE NOTHING CASE
        );
      }
    }
    console.log("GAMESTATES AFTER ENTANGLEMENT : ");
    for (let i = 0; i < this.#gameState.length; i++) {
      console.log(this.#gameState[i]);
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
   * This function increments the time spent on the board for all entries not equal to "XXX". Should be called after place occurs.
   */
  incrementTimeOnBoard() {
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 7; x++) {
        let isCertain =
          this.#board[y][x] == "PPP" || this.#board[y][x] == "YYY";
        if (isCertain) {
          this.#timeOnBoard[y][x] = 4;
        } else if (this.#board[y][x] != "XXX") {
          this.#timeOnBoard[y][x]++;
        }
      }
    }
  }

  getRandomIntInclusiveExclusive(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generate a random integer between min (inclusive) and max (exclusive)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * This function tries to find pieces who need to be measured. It returns an empty array if no pieces need to be measured.
   * @returns [x1, y1, x2, y2] or []
   */
  findPiecesToMeasure() {
    let returnValue = [];
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x < 7; x++) {
        let pieceNeedsToBeMeasured = this.#timeOnBoard[y][x] == 3;
        if (pieceNeedsToBeMeasured) {
          returnValue.push(x);
          returnValue.push(y);
        }
      }
    }
    return returnValue;
  }

  /**
   * This function returns an array of a single x and y position if we need to entangle. It returns an empty array otherwise.
   * @return [x, y] or []
   */
  doWeNeedToEntangle(firstPlacement, secondPlacement) {
    let returnValue = [];

    let firstX = firstPlacement;
    let secondX = secondPlacement;
    let firstY = this.firstOpenRow(this.#board, firstPlacement) + 1; // PLUS ONE BECAUSE WE UPDATED THE BOARD AND WE WANT THE FIRST OCCUPIED ROW
    let secondY = this.firstOpenRow(this.#board, secondPlacement) + 1;

    // CHECK TO MAKE SURE WE DON'T GO TO INDEX OUT OF BOUNDS

    // CHECK FOR DOUBLE ENTANGLEMENT. THIS CHECK IS OK BECAUSE WE ONLY EVER HAVE THREE QUANTUM PIECES ON THE BOARD AT A TIME
    if (firstY < 8) {
      let pieceBelowFirst = this.#board[firstY + 1][firstX];
      let secondPieceBelowFirst = this.#board[firstY + 2][firstX];
      let piecesBelowAlreadyEntangled =
        (secondPieceBelowFirst == "YXX" && pieceBelowFirst == "XXP") ||
        (secondPieceBelowFirst == "XXY" && pieceBelowFirst == "PXX") ||
        (secondPieceBelowFirst == "PXX" && pieceBelowFirst == "XXY") ||
        (secondPieceBelowFirst == "XXP" && pieceBelowFirst == "YXX");
      if (piecesBelowAlreadyEntangled) {
        return [];
      }
    }

    if (secondY < 8) {
      let pieceBelowFirst = this.#board[secondY + 1][secondX];
      let secondPieceBelowFirst = this.#board[secondY + 2][secondX];
      let piecesBelowAlreadyEntangled =
        (secondPieceBelowFirst == "YXX" && pieceBelowFirst == "XXP") ||
        (secondPieceBelowFirst == "XXY" && pieceBelowFirst == "PXX") ||
        (secondPieceBelowFirst == "PXX" && pieceBelowFirst == "XXY") ||
        (secondPieceBelowFirst == "XXP" && pieceBelowFirst == "YXX");
      if (piecesBelowAlreadyEntangled) {
        return [];
      }
    }

    if (firstY < 9) {
      let firstPiece = this.#board[firstY][firstX];
      let pieceBelowFirst = this.#board[firstY + 1][firstX];
      let isFirstPieceEntangled =
        (firstPiece == "YXX" && pieceBelowFirst == "XXP") ||
        (firstPiece == "XXY" && pieceBelowFirst == "PXX") ||
        (firstPiece == "PXX" && pieceBelowFirst == "XXY") ||
        (firstPiece == "XXP" && pieceBelowFirst == "YXX");
      if (isFirstPieceEntangled) {
        returnValue.push(firstX);
        returnValue.push(firstY);
        return returnValue;
      }
    }
    if (secondY < 9) {
      let secondPiece = this.#board[secondY][secondX];
      let pieceBelowSecond = this.#board[secondY + 1][secondX];
      let isSecondPieceEntangled =
        (secondPiece == "YXX" && pieceBelowFirst == "XXP") ||
        (secondPiece == "XXY" && pieceBelowSecond == "PXX") ||
        (secondPiece == "PXX" && pieceBelowSecond == "XXY") ||
        (secondPiece == "XXP" && pieceBelowSecond == "YXX");
      if (isSecondPieceEntangled) {
        returnValue.push(secondX);
        returnValue.push(secondY);
        return returnValue;
      }
    }

    return returnValue;
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

    //Update gameState
    this.#moveStates = this.#moveStates.concat("V");
    this.updateGameState(firstPlacement, column);
    this.gameStateToBoard();
    this.handleEntanglement(firstPlacement, column);

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

    this.#moveStates = this.#moveStates.concat("H");
    this.updateGameState(firstPlacement, column);
    this.gameStateToBoard();
    this.handleEntanglement(firstPlacement, column);
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

  printBoard() {
    for (let i = 0; i < this.#board.length; i++) {
      console.log(this.#board[i]);
    }
  }

  printTimeOnBoard() {
    for (let i = 0; i < this.#board.length; i++) {
      console.log(this.#timeOnBoard[i]);
    }
  }

  /**
   * Handles a place button click
   */
  reactToPlaceButton() {
    if (this.place() == "done") {
      // Update time on board first because the place functions will set the time on board value for the new piece to 1 and we don't want to accidentally update it to 2

      this.incrementTimeOnBoard();

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
    this.#moveStates = "";
    this.#timeOnBoard = this.initNewTimeOnBoard();
    this.start();
  }
}
