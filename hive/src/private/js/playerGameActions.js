import { randomInt, distance, sample, findKey } from "./constants.js";
import { MAX_FOOD, NEW_ANT_COST, STARTING_TRAIL_TIMER, dirs } from "./constants.js";
import _ from "lodash";

const getDirsTowardsQueen = function(adjacentTilesHash, moves) {
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
  return toGo;
}

const getDirsAwayFromQueen = function(adjacentTilesHash, moves) {
  return _.difference(dirs, getDirsTowardsQueen(adjacentTilesHash, moves));
}

const getRandomDirTowardsQueen = function(adjacentTilesHash, moves, makeRandomMove=true) {
  const toGo = getDirsTowardsQueen(adjacentTilesHash, moves);
  let closestEmptyTiles = toGo.filter((dir) => { return !adjacentTilesHash[dir].ant && adjacentTilesHash[dir].type !== "wall"; });
  if (closestEmptyTiles.length === 0 && makeRandomMove) {
		closestEmptyTiles = _.difference(dirs, toGo);
  }
  return sample(closestEmptyTiles);
}

const getOpenTiles = function(tiles) {
	return _.pickBy(tiles, (tile) => {
		return !tile.ant && tile.type !== "wall";
	});
}

const getTilesWithTrails = function(tiles) {
	return _.pickBy(tiles, (tile) => {
		return !_.isEmpty(tile.trails);
	});
}

const getForagingDir = function(antData) {
	const openTiles = getOpenTiles(antData.adjacentTiles);
	const tilesWithTrails = getTilesWithTrails(openTiles);
	const dirsAwayFromQueen = getDirsAwayFromQueen(antData.adjacentTiles, antData.moves);
	let possibleDirs = _.intersection(_.keys(tilesWithTrails), dirsAwayFromQueen);
	if (_.isEmpty(possibleDirs)) {
		possibleDirs = _.keys(openTiles);
	}
	return sample(possibleDirs);
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
            type: "layTrail",
            direction: getRandomDirTowardsQueen(antData.adjacentTiles, antData.moves),
            trailKey: "food" + antData.ownerId,
            trailStrength: 40,
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
          direction: getForagingDir(antData),
        };
      }
    }
  }
}

export default playerGameActions;
