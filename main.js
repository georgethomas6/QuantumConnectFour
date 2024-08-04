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



place.addEventListener("click", function (e) {
  game.play(true, false, false, false, false, false);
});

right.addEventListener("click", function (e) {
  game.play(false, true, false, false, false, false);
});

left.addEventListener("click", function (e) {
  game.play(false, false, true, false, false, false);
});

state.addEventListener("click", function (e) {
  game.play(false, false, false, true, false, false);
});

instructions.addEventListener("click", function (e) {
  game.play(false, false, false, false, true, false);
});

restart.addEventListener("click", function (e) {
  game.play(false, false, false, false, false, true);
});
