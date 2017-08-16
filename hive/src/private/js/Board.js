import Tile from "./Tile.js";
import { dirs } from "./constants.js";
import { randomInt } from "./constants.js";

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
      type = (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) ? "wall" : "food";
      this.tiles[i][j] = new Tile({
        x: i,
        y: j,
        type: type,
        ant: null
      });
    }
  }
}

Board.prototype.addRandomFood = function() {
  var numFood = randomInt(this.width, this.width);
  for (var i = 0; i < numFood; i++) {
    var t = this.getRandomVacantTile();
    t.type = "food";
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
    return null;
  }
  return this.isInBounds(x, y) ? this.tiles[x][y] : null;
}

Board.prototype.adjacentFoodTiles = function(tile) {
  var tiles = this.adjacentTiles(tile);
  var foodTiles = [];
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].type == "food") {
      foodTiles.push(tiles[i]);
    }
  }
  return foodTiles;
}

Board.prototype.adjacentTiles = function(tile) {
  var tiles = [];
  dirs.map((dir) => {
    let t = this.tileFromDirection(tile.x, tile.y, dir);
    if (t) tiles.push(t);
  });
  return tiles;
}

Board.prototype.isInBounds = function(x, y) {
  return (x > 0) && (x < this.width - 1) && (y > 0) && (y < this.height - 1);
}

Board.prototype.getRandomVacantTile = function() {
  var tile;
  while (true) {
    tile = this.tiles[randomInt(this.width)][randomInt(this.height)];
    if (tile.isVacant()) {
      return tile;
    }
  }
}

export default Board;
