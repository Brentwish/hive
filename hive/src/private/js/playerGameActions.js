import { randomInt } from "./constants.js";
import { MAXFOOD } from "./constants.js";
import { distance } from "./constants.js";

const getRandomMoveAction = function(board, tile) {
  let adjacentTiles = board.adjacentTiles(tile);
  return {
    type: "move",
    tile: adjacentTiles[randomInt(adjacentTiles.length)],
  };
}

const getMoveTowardsQueenAction = function(board, tile, queenTile) {
  let action = { type: "move" };
  let adjacentTiles = board.adjacentTiles(tile);
  let adjacentEmptyTiles = adjacentTiles.filter(function(t) {
    return !t.hasAnt();
  });
  if (adjacentEmptyTiles.length === 0) {
    action.tile = tile;
    return action;
  }
  let closestTile = adjacentEmptyTiles[0];
  for (var i = 0; i < adjacentEmptyTiles.length; i++) {
    if (distance(adjacentEmptyTiles[i], queenTile) < distance(closestTile, queenTile)) {
      closestTile = adjacentEmptyTiles[i];
    }
  }
  action.tile = closestTile;
  return action;
}

const getTransferFoodAction = function(ant, queenAnt) {
  return {
    type: "transfer",
    from: ant,
    to: queenAnt,
    amount: ant.food,
  };
}

var playerGameActions = {
  hiveAction: function(antData) {
  },

  antAction: function(antData) {
    let antTile = antData.board.tiles[antData.x][antData.y];

    if (antData.type === "queen") {
      return getRandomMoveAction(antData.board, antTile);
    } else if (antData.type === "worker") {

      let adjacentFoodTiles = antData.board.adjacentTiles(antTile, "food");
      if (antData.food === MAXFOOD) {
        if (antData.board.adjacentTiles(antTile).filter((t) => { return t.hasAnt(); }).map((t) => { return t.ant.type; }).includes("queen")) {
          return getTransferFoodAction(antTile.ant, this.getQueenTile().ant);
        } else {
          return getMoveTowardsQueenAction(antData.board, antTile, this.getQueenTile());
        }
      } else if (adjacentFoodTiles.length > 0) {
        return {
          type: "gather",
          tile: adjacentFoodTiles[randomInt(adjacentFoodTiles.length)],
        }
      } else {
        return getRandomMoveAction(antData.board, antTile);
      }

    }
  }
}

export default playerGameActions;
