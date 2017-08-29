import Tile from "./Tile.js";
import { dirs, foodGrades } from "./constants.js";
import { randomInt } from "./constants.js";
import _ from "lodash";

function Board(width, height) {
  this.tiles = [[]];
  this.width = width;
  this.height = height;
  this.trailCoords = new Set();
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

Board.prototype.addRandomFood = function(sparsityGrade, densityGrade, saturationGrade) {
  if (sparsityGrade === "none" || densityGrade === "none" || saturationGrade === "none") { return; };
  const sparsity = foodGrades[sparsityGrade];
  const density = foodGrades[densityGrade];
  const saturation = foodGrades[saturationGrade];
  let side = Math.sqrt(this.width * this.height);
  let numFoodPoints = Math.floor(sparsity * randomInt(side, side));
  let tile;
  let adjacentEmptyTiles;
  for (let i = 0; i < numFoodPoints; i++) {
    tile = this.getRandomVacantTile();
    for (let j = 0; j < Math.floor(density * side); j++) {
      tile.type = "food";
      tile.food += Math.floor(saturation * randomInt(5, 5));
      tile = _.sample(_.reject(this.adjacentTiles(tile), (t) => { return t.type === "wall"; }));
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

Board.prototype.pushNewTrailCoord = function(tile) {
  this.trailCoords.add(tile);
}

Board.prototype.updateTrails = function() {
  const trailsToRender = new Set();
  this.trailCoords.forEach((tile) => {
    if (tile.trails) {
      tile.trails = _.mapValues(tile.trails, (v) => { return v - 1; });
      tile.trails = _.omitBy(tile.trails, (trailVal) => { return trailVal <= 0; });
      if (Object.keys(tile.trails).length === 0) {
        tile.trails = null;
        trailsToRender.add(tile);
        this.trailCoords.delete(tile);
      }
    }
  });
  return trailsToRender;
}

export default Board;
