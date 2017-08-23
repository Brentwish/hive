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
      type = (i === 0 || i === this.width - 1 || j === 0 || j === this.height - 1) ? "wall" : "empty";
      this.tiles[i][j] = new Tile({
        x: i,
        y: j,
        type: type,
        ant: null,
        food: null,
      });
    }
  }
}

Board.prototype.addRandomFood = function() {
  var numFood = randomInt(this.width, this.width);
  var t;
  var adjacentEmptyTiles;
  for (var i = 0; i < numFood; i++) {
    t = this.getRandomVacantTile();
    for (var j = 0; j < this.width; j++) {
      t.type = "food";
      t.food = randomInt(2, 2);
      adjacentEmptyTiles = this.adjacentTiles(t, "empty");
      if (adjacentEmptyTiles.length > 0) {
        t = adjacentEmptyTiles[randomInt(adjacentEmptyTiles.length)];
      } else { continue; }
    }
  }
}

Board.prototype.tileFromDirection = function(x, y, dir) {
  if (dir === "left") {
    x -= 1;
  } else if (dir === "right") {
    x += 1;
  } else if (dir === "up") {
    y -= 1;
  } else if (dir === "down") {
    y += 1;
  } else {
    return null;
  }
  return this.isInBounds(x, y) ? this.tiles[x][y] : null;
}

Board.prototype.adjacentTiles = function(tile, type) {
  var tiles = [];
  dirs.map((dir) => {
    let t = this.tileFromDirection(tile.x, tile.y, dir);
    if (t) tiles.push(t);
  });

  if (type === undefined) {
    return tiles;
  } else {
    var tilesOfType = [];
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i].type === type) {
        tilesOfType.push(tiles[i]);
      }
    }
    return tilesOfType;
  }
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
