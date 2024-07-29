// TurnInProgress.js
export default class TurnInProgress {
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
  
    // Getters and Setters
  
    get column() { return this.#column; }
    get state() { return this.#state; }
    get color() { return this.#color; }
    get firstPlacement() { return this.#firstPlacement; }
    get secondPlacement() { return this.#secondPlacement; }
    get canModifyState() { return this.#canModifyState; }
  
    set column(col) { this.#column = col; }
    set state(state) { this.#state = state; }
    set color(color) { this.#color = color; }
    set firstPlacement(col) { this.#firstPlacement = col; }
    set secondPlacement(col) { this.#secondPlacement = col; }
    set canModifyState(truthValue) { this.#canModifyState = truthValue; }
  
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