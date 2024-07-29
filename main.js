// TODO implement game loop 6.
// TODO implement game state 4.
// TODO implement measure 5.
// TODO add method to check for ending somewhere so it does the thing

import Game from "./Game.js";






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
