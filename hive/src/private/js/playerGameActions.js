import { randomInt, distance, sample, findKey } from "./constants.js";
import { MAX_FOOD, NEW_ANT_COST, NEW_QUEEN_COST, STARTING_TRAIL_TIMER, dirs } from "./constants.js";
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

const getRandomDirAwayFromQueen = function(antData, makeRandomMove=true) {
  const adjacentTilesHash = antData.adjacentTiles;
  const moves = antData.moves;
  const toGo = getDirsAwayFromQueen(adjacentTilesHash, moves);
  let closestEmptyTiles = toGo.filter((dir) => { return !adjacentTilesHash[dir].ant && adjacentTilesHash[dir].type !== "wall"; });
  if (closestEmptyTiles.length === 0 && makeRandomMove) {
		closestEmptyTiles = _.difference(dirs, toGo);
  }
  return sample(closestEmptyTiles);
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

const getTilesWithTrails = function(tiles, name) {
	return _.pickBy(tiles, (tile) => {
		return !_.isEmpty(tile.trails) && tile.trails[name];
	});
}

const getForagingDir = function(antData) {
	const openTiles = getOpenTiles(antData.adjacentTiles);
	const tilesWithTrails = getTilesWithTrails(openTiles, `${antData.ownerId}_food`);
	const dirsAwayFromQueen = getDirsAwayFromQueen(antData.adjacentTiles, antData.moves);
	let trailDirs = _.intersection(_.keys(tilesWithTrails), dirsAwayFromQueen);
  const spiralDir = spiral(antData, Math.PI / 200);
  const moveCount = _.sum(_.values(antData.moves));
	if (!_.isEmpty(trailDirs)) {
	  return sample(trailDirs);
	} else if (_.includes(_.keys(openTiles), spiralDir) && moveCount < 2000) {
    return spiralDir;
	} else {
    return sample(_.keys(openTiles));
  }
}

const dirFromAngle = function(angle) {
  const r = Math.random();
  if (r < Math.pow(Math.sin(angle), 2)) {
    if (Math.sin(angle) > 0) {
      return ["left", "up"];
    } else {
      return ["right", "down"];
    }
  } else {
    if (Math.cos(angle) > 0) {
      return ["down", "left"];
    } else {
      return ["up", "right"];
    }
  }
}

const spiral = function(antData, delta) {
  const moves = antData.moves;
  const x = moves.up - moves.down;
  const y = moves.right - moves.left;
  let atan = Math.atan2(y, x);
  atan = atan > 0 ? atan : ((2 * Math.PI) + atan);

  const angle = atan - (Math.PI / 2) - delta;
  const bestDirs = dirFromAngle(angle);
  const best = bestDirs[0];
  const secondBest = bestDirs[1];
	const openDirs = _.keys(getOpenTiles(antData.adjacentTiles));
  if (_.includes(openDirs, best)) {
    return best;
  } else if (_.includes(openDirs, secondBest)) {
    return secondBest;
  } else {
    return _.sample(openDirs);
  }
}

const returnToQueenDir = function(antData) {
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
    const action = { type: "move" };
    const moveCount = _.sum(_.values(antData.moves));
    if (moveCount > 500 && distFromQueen(antData) < 8) {
      action.direction = sample(_.keys(getOpenTiles(antData.adjacentTiles)));
    } else {
      action.direction = getRandomDirTowardsQueen(antData);
      if (distFromQueen(antData) > 8) {
        action.trail = {
          name: "food",
          strength: 150,
        };
      }
    }
    return action;
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
      } else if (antData.age < 100) {
        return {
          type: "move",
          resetMoves: _.some(adjacentTiles, (t) => t.type === "wall"),
          direction: getRandomDirAwayFromQueen(antData, false),
        };
      } else if (antData.eggsLaid.worker < 25 && antData.carryingAmount >= NEW_ANT_COST) {
        return {
          type: "layEgg",
          direction: _.sample(_.keys(getOpenTiles(antData.adjacentTiles))),
          resetMoves: antData.age === 100,
        };
      } else if (antData.carryingAmount >= NEW_QUEEN_COST) {
        return {
          type: "layEgg",
          antType: "queen",
          direction: _.sample(_.keys(getOpenTiles(antData.adjacentTiles))),
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
