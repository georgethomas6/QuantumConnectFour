// Game.js

// TODO fix allowing people to change state if there is only one column
// TODO implement game loop

import TurnInProgress from "./TurnInProgress.js";
import Graphics from "./Graphics.js";

export default class Game {
  #board; // A 10 x 7 array of strings, each representing a cell in the board
  #turnInProgress; // the move that is in the process of being made
  #gameState;
  #moveStates; // this is a string of the type of moves that have been played, consists of V, C, H
  #graphics;
  #winner;
  constructor() {
    //initalize blank board
    this.#board = this.initBlankBoard();
    this.#turnInProgress = new TurnInProgress("purple");
    this.#graphics = new Graphics();
    this.#gameState = []; // this will be an array of strings
    this.#moveStates = "";
    this.#winner = "XXX";
  }

  //GETTERS

  get winner() {
    return this.#winner;
  }
  /**
   * Returns the board
   * @returns string[][]
   */
  get board() {
    return this.#board;
  }

  /**
   * Returns the TurnInProgress
   * @returns TurnInProgress
   */
  get turnInProgress() {
    return this.#turnInProgress;
  }

  /**
   * Returns the current gameState
   * @returns string[]
   */
  get gameState() {
    return this.#gameState;
  }

  /**
   * Returns the current moveState
   * @returns string
   */
  get moveStates() {
    return this.#moveStates;
  }

  /**
   * Sets the gameState
   * @param {int} state
   */
  set gameState(state) {
    this.#gameState = state;
  }

  /**
   * Sets the board
   * @param {string[][]} board
   */
  set board(board) {
    this.#board = board;
  }

  /**
   * Sets the moveStates
   * @param {string} typeofMoves
   */
  set moveStates(typeofMoves) {
    this.#moveStates = typeofMoves;
  }

  set winner(winner) {
    this.#winner = winner;
  }

  // GAME FUNCTIONS

  /**
   * Returns a 7 x 10 array of all "XXX"
   */
  initBlankBoard() {
    let newBoard = [];
    for (let i = 0; i < 8; i++) {
      newBoard.push(["XXX", "XXX", "XXX", "XXX", "XXX", "XXX", "XXX"]);
    }
    return newBoard;
  }

  /**
   * Returns "A" if it is an all or nothing case, "B" otherwise
   * @param {int} column -> entanglement is occuring in
   * @param {int} -> row first height in the entanglement
   */
  findEntanglementType(column, row) {
    if (row == 7) {
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
   * This function performs a measurement. It finds the pieces on the board that need to be measured, and filters
   * the gameState depending on what kind of measurement needs to occur
   */
  measure() {
    // If there is nothing to measure return.
    let piecesToBeMeasured = this.findPiecesToMeasure();
    if (piecesToBeMeasured.length == 0) {
      return;
    }

    let choice = this.getRandomIntInclusiveExclusive(0, 2); // "random" value for our measurement
    let ithCharacter = this.getIthCharacter(
      this.#gameState,
      this.#moveStates.length - 3
    ); // these are the columns in superposition
    let chosenColumn = choice == 0 ? ithCharacter[0] : ithCharacter[1];
    let isEntangled = this.isEntanglementOccuring();
    if (isEntangled) {
      if (this.#moveStates.charAt(this.#moveStates.length - 1) == "C") {
        // If the last move is certain we just need to pick a state out of the possible ones
        let choice = this.getRandomIntInclusiveExclusive(
          0,
          this.#gameState.length
        );
        let newGameState = [];
        newGameState.push(this.#gameState[choice]);
        this.#gameState = newGameState; // update the game state based on our choice

        // All moves on the board are now certain, make moveStates reflect that
        let newMoveState = "";
        for (let i = 0; i < this.#moveStates.length; i++) {
          newMoveState = newMoveState.concat("C");
        }

        this.#moveStates = newMoveState;
        return;
      }

      // There is a superposition but the last move is not certain, so we cannot just pick any game state as multiple are still possible after the entanglement resolves

      this.#gameState = this.#gameState.filter(
        (game) => game.charAt(this.#moveStates.length - 3) == chosenColumn
      ); // keep the game states where the move we chose happens

      // The only uncertain move on the board is the previous move played, make moveStates reflect that
      let newMoveStates = "";
      for (let y = 0; y < this.#moveStates.length - 1; y++) {
        newMoveStates = newMoveStates.concat("C");
      }
      newMoveStates = newMoveStates.concat(
        this.#moveStates.charAt(this.#moveStates.length - 1)
      );
      this.#moveStates = newMoveStates;
      return;
    }

    // There is a superposition, but it is not entangled with anyone

    this.#gameState = this.#gameState.filter(
      (game) => game.charAt(game.length - 3) == chosenColumn
    ); // filter based on the column we chose

    // The move we measured is now certain, make moveStates reflect that
    let newMoveStates = "";
    for (let y = 0; y < this.#moveStates.length - 2; y++) {
      newMoveStates = newMoveStates.concat("C");
    }

    // Append the other type of moves onto the moveStates
    newMoveStates = newMoveStates.concat(
      this.#moveStates.charAt(this.#moveStates.length - 2)
    );
    newMoveStates = newMoveStates.concat(
      this.#moveStates.charAt(this.#moveStates.length - 1)
    );
    this.#moveStates = newMoveStates;
  }

  /**
   * Returns an array of the rows at which the pieces will fall.
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
   * This function updates the board to reflect the gameState.
   */
  gameStateToBoard() {
    let moveStates = this.#moveStates;
    let newBoard = this.initBlankBoard(); // this is the board that will reflect our new gameState
    for (let i = 0; i < moveStates.length; i++) {
      switch (
        moveStates.charAt(i) //We want to switch based on the character at the ith position
      ) {
        case "C": // the piece is certain
          let column = this.#gameState[0].charAt(i); // every gameState will have the same character at the ith position since its certain
          let row = this.firstOpenRow(newBoard, column); // find the depth that piece should fall to
          // find the appropriate color so we know what string to put on the board
          if (i % 2 == 0) {
            newBoard[row][column] = "PPP";
            continue; //kill this iteration
          }
          newBoard[row][column] = "YYY";
          break;
        case "H": // the piece is a horizontal superposition
          let columnsPlayedIn = this.getIthCharacter(this.#gameState, i); // the columns played in are all of the ith characters in the gamestates
          let rows1 = this.findDepths(newBoard, columnsPlayedIn); // find the depths of the columns played in
          // place the pieces in this horizontal supperposition on the board
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
          let rows2 = this.findDepths(newBoard, colsPlayedIn2); // find the depths of the columns played in
          // place the pieces in this horizontal supperposition on the board
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
   * is given two different moves it behaves like it is responding to a quantum move. If it is given
   * the same move it behaves like it is responding to a certain move.
   * @param {int} firstPlacement -> the first half of the superposition, or the column placed in if certain
   * @param {int} secondPlacement -> the second half of the superposition, or the column placed in if certain
   */
  updateGameState(firstPlacement, secondPlacement) {
    let newGameState = [];
    let wasCertainMove = firstPlacement == secondPlacement;
    let gameStateEmpty = this.#gameState.length == 0;
    // If the game state was empty then we can modify the current gameState we have to create one
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

    this.#gameState = newGameState;
  }

  /**
   * Finds the repeating character in an entanglement
   * @returns
   */
  findCharacterInAllCase() {
    let index = this.#moveStates.length - 2;
    let ithCharacters = this.getIthCharacter(this.#gameState, index);
    let count = 0;
    for (let y = 0; y < this.#gameState.length; y++) {
      let game = this.#gameState[y];
      for (let t = 0; t < ithCharacters.length; t++) {
        let character = ithCharacters[t];
        for (let i = index; i < this.#moveStates.length; i++) {
          if (game.charAt(i) == character) {
            count++;
          }
          if (count == 2) {
            return character;
          }
        }
        count = 0;
      }
    }
    return -1;
  }

  /**
   * This function filters the game states if entanglement should occur. Should be called at the end of placing a vertical or horizontal piece.
   * @param {int} firstPlacement -> where the first half of the superposition was placed
   * @param {int} secondPlacement -> where the second half of the superposition was placed
   */
  handleEntanglement(firstPlacement, secondPlacement) {
    let isEntanglementOccuring = this.doWeNeedToEntangle(
      firstPlacement,
      secondPlacement
    ); // THIS IS THE FIRST POSITION OF THE ENTANGLEMENT
    if (isEntanglementOccuring.length != 0) {
      let entanglementType = this.findEntanglementType(
        isEntanglementOccuring[0],
        isEntanglementOccuring[1]
      );

      let superpositionIndex = this.#gameState[0].length - 1; // length - 1 because of zero indexing
      let repeatedChar = this.findCharacterInAllCase();

      if (entanglementType == "A") {
        this.#gameState = this.#gameState.filter(
          (game) =>
            (game.charAt(superpositionIndex) == repeatedChar &&
              game.charAt(superpositionIndex - 1) == repeatedChar) || // THIS IS THE ALL CASE
            (game.charAt(superpositionIndex) != repeatedChar &&
              game.charAt(superpositionIndex - 1) != repeatedChar)
        );
      } else {
        this.#gameState = this.#gameState.filter(
          (game) =>
            !(
              (game.charAt(superpositionIndex) == repeatedChar &&
                game.charAt(superpositionIndex - 1) == repeatedChar) || // THIS IS THE ALL CASE
              (game.charAt(superpositionIndex) != repeatedChar &&
                game.charAt(superpositionIndex - 1) != repeatedChar)
            ) // THIS IS THE NOTHING CASE
        );
      }
    }
  }
  /**
   * Checks for an uncertain under the pieces played in a given column
   * @param {int} column -> column to check for uncertain pieces in
   * @param {int} row -> first spot under the piece being checked in a group
   * @returns true if there are no uncertain pieces in the given column, false otherwise
   */
  noProppedPiece(column, row) {
    while (row < 8) {
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
    for (let y = 7; y > 4; y--) {
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
    for (let y = 7; y > 1; y--) {
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
    for (let y = 7; y > 4; y--) {
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
    for (let y = 2; y < 5; y++) {
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
   * @returns true if the game has been drawn, false otherwise
   */
  isGameDrawn() {
    let count = 0;
    for (let y = 7; y > 1; y--) {
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

  getRandomIntInclusiveExclusive(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generate a random integer between min (inclusive) and max (exclusive)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Returns the first instance of a value occuring on the board in a given column
   * @param {string} target
   * @param {int} column
   * Returns row of first occurance of target. Returns -1 if not found
   */
  findInColumn(target, column) {
    for (let y = 7; y > 0; y--) {
      let foundTarget = this.#board[y][column] == target;
      if (foundTarget) {
        return y;
      }
    }
    return -1;
  }
  /**
   * This function tries to find pieces who need to be measured. It returns an empty array if no pieces need to be measured.
   * @returns [x1, y1, x2, y2] or []
   */
  findPiecesToMeasure() {
    let indexToMeasure = this.#moveStates.length - 3;
    if (indexToMeasure < 0) {
      return [];
    }

    if (this.#moveStates.charAt(indexToMeasure) == "C") {
      return [];
    }

    let returnValue = [];
    let state = this.#moveStates.charAt(indexToMeasure);
    let options = this.getIthCharacter(
      this.#gameState,
      this.#moveStates.length - 3
    );
    let colorToLookFor = this.#moveStates.length % 2;
    if (colorToLookFor == 1 && state == "V") {
      let target = "XXP";
      returnValue.push(options[0]);
      returnValue.push(this.findInColumn(target, options[0]));
      returnValue.push(options[1]);
      returnValue.push(this.findInColumn(target, options[1]));
      return returnValue;
    } else if (colorToLookFor == 1 && state == "H") {
      let target = "PXX";
      returnValue.push(options[0]);
      returnValue.push(this.findInColumn(target, options[0]));
      returnValue.push(options[1]);
      returnValue.push(this.findInColumn(target, options[1]));
      return returnValue;
    } else if (colorToLookFor == 0 && state == "V") {
      let target = "XXY";
      returnValue.push(options[0]);
      returnValue.push(this.findInColumn(target, options[0]));
      returnValue.push(options[1]);
      returnValue.push(this.findInColumn(target, options[1]));
      return returnValue;
    } else if (colorToLookFor == 0 && state == "H") {
      let target = "YXX";
      returnValue.push(options[0]);
      returnValue.push(this.findInColumn(target, options[0]));
      returnValue.push(options[1]);
      returnValue.push(this.findInColumn(target, options[1]));
      return returnValue;
    }

    return [];
  }

  /**
   * Is entanglement occuring
   */
  isEntanglementOccuring() {
    for (let y = 7; y > 1; y--) {
      for (let x = 0; x < 7; x++) {
        let isEntangled =
          (this.#board[y][x] == "PXX" && this.#board[y - 1][x] == "XXY") ||
          (this.#board[y][x] == "XXP" && this.#board[y - 1][x] == "YXX") ||
          (this.#board[y][x] == "YXX" && this.#board[y - 1][x] == "XXP") ||
          (this.#board[y][x] == "XXY" && this.#board[y - 1][x] == "PXX");
        if (isEntangled) {
          return true;
        }
      }
    }
    return false;
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
    if (firstY < 6) {
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

    if (secondY < 6) {
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

    if (firstY < 7) {
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
    if (secondY < 7) {
      let secondPiece = this.#board[secondY][secondX];
      let pieceBelowSecond = this.#board[secondY + 1][secondX];
      let isSecondPieceEntangled =
        (secondPiece == "YXX" && pieceBelowSecond == "XXP") ||
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
        uniqueChars.add(parseInt(str.charAt(i)));
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
    let validClassicMove = state == "certain" && row >= 2;
    let validQuantumMove =
      state != "certain" &&
      row >= 2 &&
      firstPlacement != column &&
      this.#board[2][column] != "PPP" &&
      this.#board[2][column] != "YYY";
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
    // We have to call after gamdState to board because handleEntanglement relies on the data stored in the board to find entanglement
    this.handleEntanglement(firstPlacement, column);
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
    let depth = firstOpenRow >= 2 ? 1 : firstOpenRow;
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
    for (let y = 0; y < 8; y++) {
      let spotIsEmpty = board[y][column] == "XXX";
      if (spotIsEmpty) {
        depth++;
      } else {
        return depth;
      }
    }

    return depth;
  }

  play(
    placing,
    movingRight,
    movingLeft,
    changingState,
    changingPages,
    restarting
  ) {
    if (this.#winner == "XXX" && !this.isGameDrawn()) {
      console.log("WINNER IS NOT YET DETERMINED");
      if (placing) {
        this.reactToPlaceButton();
        return;
      } else if (movingRight) {
        this.reactToRightButton();
        return;
      } else if (movingLeft) {
        this.reactToLeftButton();
        return;
      } else if (changingState) {
        this.reactToStateButton();
        return;
      }
    }

    if (changingPages) {
      window.location.href = "instructions.html";
      return;
    }
    if (restarting) {
      this.reactToRestartButton();
      return;
    }

    if (this.#winner != "XXX") {
      // TODO
    }

    if (this.isGameDrawn) {
      // TODO
    }
  }

  /**
   * Begins the game
   */
  start() {
    this.drawEverything(this.#board, this.#turnInProgress.column);
  }

  /**
   * Handles a right button click
   */
  reactToRightButton() {
    this.#turnInProgress.incrementPosition();
    if (this.#turnInProgress.column == this.#turnInProgress.firstPlacement) {
      this.#turnInProgress.incrementPosition();
    }
    this.drawEverything(this.#board, this.#turnInProgress.column);
  }

  /**
   * Handles a left button click
   */
  reactToLeftButton() {
    this.#turnInProgress.decrementPosition();
    if (this.#turnInProgress.column == this.#turnInProgress.firstPlacement) {
      this.#turnInProgress.decrementPosition();
    }
    this.drawEverything(this.#board, this.#turnInProgress.column);
  }

  /**
   * Handles a state button click
   */
  reactToStateButton() {
    let canModifyState = this.#turnInProgress.canModifyState;
    if (canModifyState) {
      this.#turnInProgress.changeState();
    }
    this.drawEverything(this.#board, this.#turnInProgress.column);
  }

  printBoard() {
    for (let i = 0; i < this.#board.length; i++) {
      console.log(this.#board[i]);
    }
  }

  drawEverything(board, turnInProgressColumn) {
    this.#graphics.clearCanvasGrey();
    this.#graphics.drawGridLines();
    this.#graphics.drawPieces(board);
    this.#graphics.drawTurnInProgress(
      this.#turnInProgress.column,
      this.turnInProgressDepth(turnInProgressColumn),
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
      this.measure();
      this.gameStateToBoard();
      if (this.checkWinner() != "XXX") {
        this.#winner = this.checkWinner();
      } else if (this.isGameDrawn()) {
        this.#winner = "DDD";
      }
      this.changeTurn();
    }
    this.drawEverything(this.#board, this.#turnInProgress.column);
  }

  /**
   * Handles a restart button click
   */
  reactToRestartButton() {
    this.#board = this.initBlankBoard();
    this.#turnInProgress = new TurnInProgress("purple");
    this.#gameState = [];
    this.#moveStates = "";
    this.#winner = "XXX";
    this.start();
  }
}
