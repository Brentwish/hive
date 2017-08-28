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

const distFromQueen = function(antData) {
	const m = antData.moves;
	return Math.abs(m.up - m.down) + Math.abs(m.left - m.right);
}

const getRandomDirTowardsQueen = function(antData, makeRandomMove=true) {
  const adjacentTilesHash = antData.adjacentTiles;
  const moves = antData.moves;
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
	let trailDirs = _.intersection(_.keys(tilesWithTrails), dirsAwayFromQueen);
  const spiralDir = getNextSpiralDir(antData.moves.up + 5, antData.moves.left, antData.moves.down, antData.moves.right);
  const moveCount = _.sum(_.values(antData.moves));
	if (!_.isEmpty(trailDirs)) {
	  return sample(trailDirs);
	} else if (_.includes(_.keys(openTiles), spiralDir) && moveCount < 200) {
    return spiralDir;
	} else if (moveCount < 1000) {
    return sample(_.keys(openTiles));
  } else {
    return getRandomDirTowardsQueen(antData);
  }
}

const getNextSpiralDir = function(u, l, d, r) {
  if (u + l <= d + r && d === r) {
    return "up";
  } else if (l !== u && d === r) {
    return "left";
  } else if (u + l > d + r && u === l) {
    return "down";
  } else {
    return "right";
  }
}

const returnToQueenDir = function(antData) {
  const moveCount = _.sum(_.values(antData.moves));
  if (moveCount > 500 && distFromQueen(antData) < 8) {
    return sample(_.keys(getOpenTiles(antData.adjacentTiles)));
  } else {
    return getRandomDirTowardsQueen(antData)
  }
};

const returnToQueenAction = function(antData) {
  const queenTile = _.values(antData.adjacentTiles).find((t) => {
    return t.ant && t.ant.type === "queen" && t.ant.ownerId === antData.ownerId;
  });
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
      direction: returnToQueenDir(antData),
      trailKey: "food" + antData.ownerId,
      trailStrength: 100,
    };
  }
}

var playerGameActions = {
  antAction: function(antData) {
    const adjacentTiles = Object.values(antData.adjacentTiles);
    const emptyTiles = adjacentTiles.filter((t) => { return !t.ant; });
    const adjacentEnemies = adjacentTiles.filter((t) => { return t.ant && t.ant.ownerId !== antData.ownerId; });

    if (antData.type === "queen") {
      if (adjacentEnemies.length > 0) {
        return {
          type: "attack",
          direction: findKey(antData.adjacentTiles, sample(adjacentEnemies)),
        }
      } else if (antData.carryingAmount >= NEW_ANT_COST) {
        return {
          type: "layEgg",
          direction: getRandomDirTowardsQueen(antData),
        };
      } else if (antData.moves.left !== antData.moves.right || antData.moves.up !== antData.moves.down) {
        return {
          type: "move",
          direction: getRandomDirTowardsQueen(antData, false),
        };
			} else {
        return {
          type: "none",
        };
      }
    } else if (antData.type === "worker") {
      const adjacentFoodTiles = adjacentTiles.filter((t) => { return t.type === "food"; });

      if (antData.carryingAmount === MAX_FOOD) {
        return returnToQueenAction(antData);
      } else if (adjacentEnemies.length > 0) {
        return {
          type: "attack",
          direction: findKey(antData.adjacentTiles, sample(adjacentEnemies)),
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
