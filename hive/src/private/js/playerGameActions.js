import { randomInt, randomArrayElement, distance, sample, findKey } from "./constants.js";
import { MAX_FOOD, NEW_ANT_COST, dirs } from "./constants.js";

const getRandomDirTowardsQueen = function(adjacentTilesHash, moves, makeRandomMove=true) {
  let toGo = [];
  if (moves.left > moves.right) {
    toGo.push("right");
  } else if (moves.left < moves.right) {
    toGo.push("left");
  }
  if (moves.up > moves.down) {
    toGo.push("down");
  } else if (moves.up < moves.down) {
    toGo.push("up");
  }

  let closestEmptyTiles = toGo.filter((dir) => { return !adjacentTilesHash[dir].ant && adjacentTilesHash[dir].type !== "wall"; });
  if (closestEmptyTiles.length === 0 && makeRandomMove) {
		closestEmptyTiles = dirs.filter((dir) => { return toGo.indexOf(dir) === -1 });
  }
  return sample(closestEmptyTiles);
}

var playerGameActions = {
  antAction: function(antData) {
    const adjacentTiles = Object.values(antData.adjacentTiles);
    const emptyTiles = adjacentTiles.filter((t) => { return !t.ant; });

    if (antData.type === "queen") {
      if (antData.carryingAmount >= NEW_ANT_COST) {
        return {
          type: "layEgg",
          direction: getRandomDirTowardsQueen(antData.adjacentTiles, antData.moves),
        };
      } else if (antData.moves.left !== antData.moves.right || antData.moves.up !== antData.moves.down) {
        return {
          type: "move",
          direction: getRandomDirTowardsQueen(antData.adjacentTiles, antData.moves, false),
        };
			} else {
        return {
          type: "none",
        };
      }
    } else if (antData.type === "worker") {
      const adjacentFoodTiles = adjacentTiles.filter((t) => { return t.type === "food"; });

      if (antData.carryingAmount === MAX_FOOD) {
        const queenTile = adjacentTiles.filter((t) => { return t.ant && t.ant.type === "queen" && t.ant.ownerId === antData.ownerId; })[0];
        if (queenTile) {
          return {
            type: "transfer",
            direction: findKey(antData.adjacentTiles, queenTile),
            amount: antData.carryingAmount,
            resetMoves: true,
          };
        } else {
          //Move towards queen
          return {
            type: "move",
            direction: getRandomDirTowardsQueen(antData.adjacentTiles, antData.moves),
          };
        }
      } else if (adjacentFoodTiles.length > 0) {
        return {
          type: "gather",
          direction: findKey(antData.adjacentTiles, sample(adjacentFoodTiles)),
        }
      } else {
        return {
          type: "move",
          direction: findKey(antData.adjacentTiles, sample(emptyTiles)),
        };
      }
    }
  }
}

export default playerGameActions;
