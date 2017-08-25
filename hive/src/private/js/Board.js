import Tile from "./Tile.js";
import { dirs } from "./constants.js";
import { randomInt } from "./constants.js";

function Board(width, height) {
  this.tiles = [[]];
  this.width = width;
  this.height = height;
  this.trailCoords = [];
}

Board.prototype.getTileFromCoords = function(coords) {
  return this.tiles[coords.x][coords.y];
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
        trail: null,
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
  let u = x;
  let v = y;
  if (dir === "left") {
    u -= 1;
  } else if (dir === "right") {
    u += 1;
  } else if (dir === "up") {
    v -= 1;
  } else if (dir === "down") {
    v += 1;
  } else {
    return null;
  }
  return this.isInBounds(u, v) ? this.tiles[u][v] : null;
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
  return (x >= 0) && (x < this.width) && (y >= 0) && (y < this.height);
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

Board.prototype.pushNewTrailCoord = function(coord) {
  this.trailCoords.push(coord);
}

Board.prototype.updateTrails = function() {
  this.trailCoords.forEach((coord) => {
    let tileTrails = this.getTileFromCoords(coord).trails;
    Object.keys(tileTrails).forEach((trail) => {
      tileTrails[trail] -= 1;
      if (tileTrails[trail] === 0) {
        delete tileTrails[trail];
      }
    });
    if (Object.keys(tileTrails).length === 0) {
      this.trailCoords = this.trailCoords.filter((trailCoord) => {
        return trailCoord.x !== coord.x && trailCoord.y !== coord.y;
      });
      tileTrails = null;
    }
  });
}

export default Board;
