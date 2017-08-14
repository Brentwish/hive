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

Board.prototype.randomBoard = function() {
  for (var i = 0; i < this.width; i++) {
    this.squares[i] = [];
    for (var j = 0; j < this.height; j++) {
      this.squares[i][j] = Math.floor(Math.random() * Colors.length);
    }
  }
}

Board.prototype.borderedBoard = function() {
  var color = 1;
  for (var i = 0; i < this.width; i++) {
    this.squares[i] = [];
    for (var j = 0; j < this.height; j++) {
      color = 1;
      if (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) {
        color = 2;
      }
      this.squares[i][j] = color;
    }
  }
}

Board.prototype.isInBounds = function(position, dir) {
  return (dir == "left" && position.x > 1) ||
  (dir == "up" && position.y > 1) ||
  (dir == "right" && position.x < this.width - 2) ||
  (dir == "down" && position.y < this.height - 2)
}

Board.prototype.getRandomPosition = function() {
  return {
    x: Math.floor(Math.random() * this.width),
    y: Math.floor(Math.random() * this.height)
  };
}

export default Board;
