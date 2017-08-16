const dirs = ["left", "right", "up", "down"];

var playerGameActions = {
  hiveAction: function(antData) {
		//
  },

  antAction: function(antData) {
    var action = {};
    action.type = "move";
    action.dir = dirs[Math.floor(Math.random() * dirs.length)];
    return action;
  }
}

export default playerGameActions;
