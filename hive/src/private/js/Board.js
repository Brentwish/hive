const Colors = [
  "Black",
  "White",
  "Green",
  "Blue",
  "Red"
];

function Board(width, height) {
  this.squares = [[]];
  this.width = width;
  this.height = height;
}

Board.prototype.randomBoard = function(width, height) {
  this.width = width;
  this.height = height;

  for (var i = 0; i < width; i++) {
    this.squares[i] = [];
    for (var j = 0; j < height; j++) {
      this.squares[i][j] = Math.floor(Math.random() * Colors.length);
    }
  }
}

export default Board;
