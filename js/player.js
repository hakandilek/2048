function Player(gameManager) {
  this.gameManager = gameManager;
  this.move = 0;

  gameManager.actuator.on("moveEnd", this.moveEnd.bind(this));
}

// start playing the game
Player.prototype.play = function() {
  console.log("start playing");

  this.nextMove();
};

// do the next move
Player.prototype.nextMove = function() {

  // find the direction to move to
  var loops = 0;
  var direction = this.move % 4;
  while (!this.canMove(direction) && loops++ < 4) {
    this.move++;
    direction = this.move % 4;
  }

  // do move
  if (loops < 4) {
    this.gameManager.move(direction);
    this.move++;
  }
};

// trigger the next move
Player.prototype.moveEnd = function() {
  console.log("move ended.");
  if (this.gameManager.isGameTerminated()) {
    console.log("terminated!");
    return;
  }
  
  console.log("next move : " + this.move);  
  this.nextMove();
};

// find if move to this direction is possible
Player.prototype.canMove = function(direction) {
  var gm = this.gameManager;
  var cell, tile;

  var vector = gm.getVector(direction);
  var traversals = gm.buildTraversals(vector);
  var canMove = false;

  traversals.x.some(function(x) {
    traversals.y.some(function(y) {
      cell = { x : x, y : y };
      tile = gm.grid.cellContent(cell);

      if (tile) {
        var positions = gm.findFarthestPosition(cell, vector);
        var next      = gm.grid.cellContent(positions.next);
        var farthest  = positions.farthest;
        
        canMove = canMove 
                    || (farthest.x != cell.x || farthest.y != cell.y) 
                    || (next && next.value === tile.value && !next.mergedFrom);
      }
      
      return canMove;
    });

    return canMove;
  });

  return canMove;
};
