export default class TurnInProgress {
  #color; // {string} should only be "purple" or "yellow"
  #column; // {int} where a piece should be placed currently
  #state; // {string} should only be "certain", "vertical" or "horizontal"
  #firstPlacement; // {int} 0-6 the first vector in the superposition
  #secondPlacement; // {int} 0-6 the second vector in the superposition
  #canModifyState; // {boolean}

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

  // Getters

  get column() {
    return this.#column;
  }
  get state() {
    return this.#state;
  }
  get color() {
    return this.#color;
  }
  get firstPlacement() {
    return this.#firstPlacement;
  }
  get secondPlacement() {
    return this.#secondPlacement;
  }
  get canModifyState() {
    return this.#canModifyState;
  }

  // Setters

  set column(col) {
    this.#column = col;
  }
  set state(state) {
    this.#state = state;
  }
  set color(color) {
    this.#color = color;
  }
  set firstPlacement(col) {
    this.#firstPlacement = col;
  }
  set secondPlacement(col) {
    this.#secondPlacement = col;
  }
  set canModifyState(truthValue) {
    this.#canModifyState = truthValue;
  }

  // Functions

  incrementPosition() {
    this.#column++;
    if (this.#column > 6) {
      this.#column = 0;
    }
  }

  decrementPosition() {
    this.#column--;
    if (this.#column < 0) {
      this.#column = 6;
    }
  }

  changeState() {
    if (this.#state === "certain") {
      this.#state = "horizontal";
    } else if (this.#state === "horizontal") {
      this.#state = "vertical";
    } else if (this.#state === "vertical") {
      this.#state = "certain";
    }
  }
}
