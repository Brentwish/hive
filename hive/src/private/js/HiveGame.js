import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";
import playerGameActions from "./playerGameActions.js";
import { randomInt, playerColors, dirs, MAX_FOOD, NEW_ANT_COST, EGG_TIMER } from "./constants.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
  this.coordsToRender = [];
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.board.addRandomFood();
  for (let i = 0; i < 5; i++) {
    this.players.push(new Player({
      id: i + 1,
      color: playerColors[i],
      ants: [],
      board: this.board,
      playerGameActions: playerGameActions,
    }));
  }

  for (var i = 0; i < this.players.length; i++) {
    var queen = new Ant({
      id: 1,
      type: 'queen',
      owner: this.players[i],
      tile: this.board.getRandomVacantTile(),
      food: 35,
      eggTimer: 0,
      moves: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
      },
    });
    this.players[i].ants.push(queen);
    queen.tile.ant = queen;
  }
  this.coordsToRender = new Set();
}

HiveGame.prototype.update = function() {
  this.turn += 1;
  this.updatePlayers();
}

HiveGame.prototype.pushCoordToRender = function(coord) {
  this.coordsToRender.add(JSON.stringify(coord));
}

HiveGame.prototype.getUpdatedTiles = function() {
  return [...this.coordsToRender].map((coordJson) => {
    const coord = JSON.parse(coordJson);
    return this.board.getTileFromCoords(coord);
  });
}

HiveGame.prototype.clearUpdatedTiles = function() {
  this.coordsToRender.clear();
}

HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    for (var j = 0; j < this.players[i].ants.length; j++) {
      if (this.players[i].ants[j].eggTimer === 0) {
        var action = this.players[i].antAction(this.players[i].ants[j].toDataHash());
        this.performAction(this.players[i].ants[j], action);
      } else {
        this.players[i].ants[j].eggTimer -= 1;
      }
    }
  }
}

HiveGame.prototype.isLegalAction = function(entity, action) {
  let targetTile;
  if (action.direction && dirs.includes(action.direction)) {
    targetTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.direction);
    if (!targetTile) return false;
  } else {
    return false;
  }
  switch (action.type) {
    case "move":
      return targetTile.isVacant();
    case "gather":
      return targetTile.isFood() && targetTile.food > 0 && entity.food < MAX_FOOD;
    case "transfer":
      return targetTile.hasAnt() && entity.food >= action.amount;
    case "layEgg":
      return targetTile.isVacant() && entity.type === "queen" && entity.food > NEW_ANT_COST;
    default:
      return false;
  }
}

HiveGame.prototype.performAction = function(entity, action) {
  if (this.isLegalAction(entity, action)) {
    let targetTile;
    if (action.direction) {
      targetTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.direction);
    }
    switch (action.type) {
      case "move":
        this.pushCoordToRender(entity.tile.coords());
        entity.moves[action.direction] += 1;
        entity.tile.ant = null;
        targetTile.ant = entity;
        entity.tile = targetTile;
        this.pushCoordToRender(targetTile.coords());
        break;
      case "gather":
        targetTile.food -= 1;
        entity.food += 1;
        if (targetTile.food === 0) {
          targetTile.type = "empty";
          targetTile.food = null;
          this.pushCoordToRender(targetTile.coords());
        }
        break;
      case "transfer":
        const quantToTransfer = targetTile.ant.type === "queen" ? action.amount : Math.min(MAX_FOOD - targetTile.ant.food, action.amount);
        entity.food -= quantToTransfer;
        targetTile.ant.food += quantToTransfer;
        if (action.resetMoves) {
          entity.moves = {
            left: 0,
            right: 0,
            up: 0,
            down: 0,
          };
        }
        break;
      case "layEgg":
        const worker = new Ant({
          id: entity.owner.ants.length + 1,
          type: 'worker',
          owner: entity.owner,
          tile: entity.tile,
          food: 0,
          eggTimer: EGG_TIMER,
          moves: {
            left: 0,
            right: 0,
            up: 0,
            down: 0,
          },
        });
        entity.moves[action.direction] += 1;
        entity.owner.ants.push(worker);
        entity.tile.ant = worker;
        this.pushCoordToRender(worker.tile.coords());
        entity.food -= NEW_ANT_COST;
        targetTile.ant = entity;
        entity.tile = targetTile;
        this.pushCoordToRender(entity.tile.coords());
        break;
    }
  }
}

export default HiveGame;
