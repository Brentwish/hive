import Tile from "./Tile.js";

function Board(width, height) {
  this.tiles = [[]];
  this.width = width;
  this.height = height;
}

Board.prototype.borderedBoard = function() {
  var type;
  for (var i = 0; i < this.width; i++) {
    this.tiles[i] = [];
    for (var j = 0; j < this.height; j++) {
      type = (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) ? "wall" : "empty";
      this.tiles[i][j] = new Tile({
        x: i,
        y: j,
        type: type,
        ant: null
      });
    }
  }
}

Board.prototype.tileFromDirection = function(x, y, dir) {
  if (dir == "left") {
    x -= 1;
  } else if (dir == "right") {
    x += 1;
  } else if (dir == "up") {
    y -= 1;
  } else if (dir == "down") {
    y += 1;
  } else {
    return false;
  }
  return this.tiles[x][y];
}

Board.prototype.isInBounds = function(x, y) {
  return (x > 0) && (x < this.width - 1) && (y > 0) && (y < this.height - 1);
}

Board.prototype.getRandomVacantTile = function() {
  var tile;
  while (true) {
    tile = this.tiles[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)];
    if (tile.isVacant()) {
      return tile;
    }
  }
}

export default Board;
