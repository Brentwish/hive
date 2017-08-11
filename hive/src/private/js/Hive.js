import Board from "./Board.js";

function Hive() {
  this.board = new Board(200,200);
}

Hive.prototype.update = function(updateCanvas) {
  this.board.randomBoard(this.board.width, this.board.height);
}

export default Hive;
