const dirs = ["left", "right", "up", "down"];

var playerGameActions = {
  hiveAction: function(antData) {
    console.log(this.id);
  },

  antAction: function(antData) {
    var action = {};
    action.type = "move";
    action.dir = dirs[Math.floor(Math.random() * dirs.length)];
    return action;
  }
}

export default playerGameActions;
