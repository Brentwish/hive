import { randomInt } from "./constants.js";

var playerGameActions = {
  hiveAction: function(antData) {
		//
  },

  antAction: function(antData) {
    var action = {};
    var antTile = antData.board.tiles[antData.x][antData.y];
    var adjacentTiles = antData.board.adjacentTiles(antTile);
    var adjacentFoodTiles = antData.board.adjacentFoodTiles(antTile);

    var moveRandom = function() {
      ////Removes the last tile it moved from to make movement look cleaner
      if (antData.prevTile) {
        var copy = adjacentTiles;
        copy.forEach(function(tile, i) {
          if (tile.x === antData.prevTile.x && tile.y === antData.prevTile.y) {
            adjacentTiles.splice(i, 1);
          }
        });
      }
      ////
      action.type = "move";
      action.tile = adjacentTiles[randomInt(adjacentTiles.length)];
    }

    if (antData.type === "queen") {
      moveRandom();
    } else if (antData.type === "worker") {
      if (adjacentFoodTiles.length > 0) {
        action.type = "gather";
        action.tile = adjacentFoodTiles[randomInt(adjacentFoodTiles.length)];
      } else {
        moveRandom();
      }
    }
    return action;
  }
}

export default playerGameActions;
