const Colors = [
  "Blue",
  "Green",
  "Red",
  "Black",
  "White",
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
  var color = 4;
  for (var i = 0; i < this.width; i++) {
    this.squares[i] = [];
    for (var j = 0; j < this.height; j++) {
      color = 4;
      if (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) {
        color = 3;
      }
      this.squares[i][j] = color;
    }
  }
}

Board.prototype.isPositionFromDirectionAnt = function(position, dir) {
  var pos = this.positionFromDirection(position, dir);
  return this.squares[pos.x][pos.y] == 0 ||
    this.squares[pos.x][pos.y] == 1 ||
    this.squares[pos.x][pos.y] == 2;
}

Board.prototype.positionFromDirection = function(position, dir) {
  if (dir == "left") {
    return { x: position.x - 1, y: position.y }
  } else if (dir == "right") {
    return { x: position.x + 1, y: position.y }
  } else if (dir == "up") {
    return { x: position.x, y: position.y - 1 }
  } else if (dir == "down") {
    return { x: position.x, y: position.y + 1 }
  } else {
    return null;
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
