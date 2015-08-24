/* variables to turn column and row values into x and y values
 */
var SPRITE_WIDTH = 101;
var SPRITE_HEIGHT = 83;

/* 5 element array with either a 0 or 1 as the value representing the tiles
 * in row 1.  initially all set to 0 since all are empty
 */
var emptySlots = [0, 0, 0, 0, 0];

/* function to generate a random integer with the range as a parameter
 * Followed mozilla developer network's examples on Math.random()
 * Used Math.floor to ensure uniform distribution
 */
var randomNumber = function(low, high) {
    return Math.floor(Math.random() * ((high + 1) - low)) + low;
};

/* creates Goal class which spawns on a random square.
 * sets the column and row for the tile
 */
var Goal = function() {
    this.sprite = 'images/Selector.png';
    this.col = randomNumber(1, 5);
    this.row = randomNumber(2, 5);
};

/* creates render method for Goal class
 * same as render methods for enemy, player, and rock class
 * draws the goal class sprite at the specified x and y
 * location on the canvas
 */
Goal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* creates update method for the Goal class
 * converts the column and row of the Goal object into an x and
 * y position based on dimensions of sprite
 */
Goal.prototype.update = function() {
    this.x = (this.col - 1) * SPRITE_WIDTH;
    this.y = (this.row - 1) * SPRITE_HEIGHT - 40;
};

/* creates Rock class
 * always starts on row 5
 * sets random column value
 */
var Rock = function() {

    this.sprite = 'images/Rock.png';
    this.col = randomNumber(1, 5);
    this.row = 5;
    this.sameSpot = 0;

    /* checks whether another rock is in the same spot.  if so chooses new starting location.
     * only performs this check if this is not the first instance of the rock object
     */
    if (allRocks.length > 1) {
        this.col = checkSpawnRocks(this.col);
    }
};

/* loops through allRocks for any rocks that are in row 5
 * if a rock is in row 5 and is in the same column as the input
 * then a new random column number is returned
 */
var checkSpawnRocks = function(column) {
    allRocks.forEach(function(rock) {
        if (rock.row == 5 && rock.col == column) {
            column = randomNumber(1, 5);
            columns = checkSpawnRocks(column);
        }
    });

    return column;
};

/* creates update method for the Rock class
 * converts the column and row of the Rock object into an x and
 * y position based on dimensions of sprite
 */
Rock.prototype.update = function(dt) {
    this.x = (this.col - 1) * SPRITE_WIDTH;
    this.y = (this.row - 1) * SPRITE_HEIGHT - 40;
};

/* creates render method for Rock class
 * same as render methods for enemy, player, and goal class
 * draws the rock object sprite at the specified x and y
 * location on the canvas
 */
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Creates moveRock method for the Rock class
 * takes movement of the player object as input (+x/-x right/left, +y/-y up/down)
 * checks if player is moving into the same tile as the rock object
 * if true, then moves rock one tile over
 */
Rock.prototype.moveRock = function(x, y) {

    /* creates variables to hold pre-movement info
     * for both rock object and player object
     */
    var oldRockCol = this.col;
    var oldRockRow = this.row;

    var oldPlayerCol = player.col - x;
    var oldPlayerRow = player.row - y;

    if (this.col == player.col && this.row == player.row) {

        this.col = this.col + x;
        this.row = this.row + y;

        /* if rock is on the right or left edge of the canvas, will get pushed
         * to the other side
         */
        if (this.col < 1) {
            this.col = 5;
        }
        if (this.col > 5) {
            this.col = 1;
        }

        /* when rock has been moved to row 1, code checks through the emptySlots
         * array to see if there is already a rock in the same column on the
         * 1st row.  If the space is empty, then the rock is moved into the available space
         * and the emptySlots is updated.  If the space is full, then the rock and the player
         * row is moved back to what it was before
         */
        if (this.row == 1) {
            if (emptySlots[this.col - 1] == 0) {
                emptySlots[this.col - 1] = 1;
            } else {
                this.row = oldRockRow;
                player.row = oldPlayerRow;
            }
        }

        /* Prevents rock from entering the 6th row
         */
        if (this.row > 5) {
            this.row = oldRockRow;
            player.row = oldPlayerRow;
        }

        /* calls function checkRocks to see if there is another rock in the spot this rock
         * was going to move to.  If so, rock and player do not move.
         */
        var check = checkRocks();
        if (check == 0) {
            this.col = oldRockCol;
            this.row = oldRockRow;
            player.col = oldPlayerCol;
            player.row = oldPlayerRow;
        }

        /* checks if rock object is on the goal tile.  will spawn a new rock
         * as long as there are not already 5 rock objects in the allRocks array
         */
        if (allRocks.length < 5) {
            allRocks.forEach(function(rock) {
                if (rock.col == goal.col && rock.row == goal.row) {
                    allRocks.push(new Rock());
                    if (allRocks.length < 5) {
                        goal = new Goal();
                    } else {
                        goal.row = 10;
                    }
                }
            });
        }
    }
};

/* checks whether two rocks are in same location*/
var checkRocks = function() {
    var length = allRocks.length;

    for (i = 0; i < length; i++) {
        for (j = i + 1; j < length; j++) {
            if (allRocks[i].row == allRocks[j].row && allRocks[i].col == allRocks[j].col) {
                return 0;
            }
        }
    }
};

/* Enemies our player must avoid
 */
var Enemy = function() {

    /* The image/sprite for our enemies, this uses
     * a helper we've provided to easily load images
     */
    this.sprite = 'images/enemy-bug.png';

    /* Generate random integer between 2-4 to set starting row of enemy
     * Followed mozilla developer network's examples on Math.random()
     * Used Math.floor to ensure uniform distribution
     */
    this.row = randomNumber(2, 4);
    this.col = -1;
    this.x = (this.col - 1) * SPRITE_WIDTH;
    this.y = (this.row - 1) * SPRITE_HEIGHT - 40;
    this.direction = 'right';

    /* Generates random integer between 1 and 4 to use as speed multiplier.
     * Included in constructor function since each enemy should move
     * at a constant speed, so only want the speed multiplier to be
     * generated once per instance of Enemy
     */
    this.speed = randomNumber(1, 4);
};

/* Update the enemy's position, each enemy moves at a constant speed
 * Parameter: dt, a time delta between ticks,
 */
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt * 100;
    this.col = Math.ceil(this.x / SPRITE_WIDTH) + 1;

    /* changes column of enemey when it is moving to the left for
     * better collision detection
     */
    if (this.direction == 'left') {
        this.col = this.col - 1;
    }

};

/* draws enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Player class - sets starting point (bottom row, middle column) and image sprite for the player
 */
var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.col = 3;
    this.row = 6;
};

/* Takes key presses and changes position of player according to which
 * key is pressed.  sends either positive or negative x/y values to
 * playerMove method based on which direction the player is moving.
 */

Player.prototype.handleInput = function(key) {
    var x = 0;
    var y = 0;

    if (key == 'left') {
        x = -1;
    } else if (key == 'right') {
        x = 1;
    } else if (key == 'up' && this.row > 2) {
        y = -1;
    } else if (key == 'down' && this.row < 6) {
        y = 1;
    }

    this.movePlayer(x, y);

    allRocks.forEach(function(rock) {
        rock.moveRock(x, y);
    });
};

/*sets new x and y location of player based off the values sent by the handleInput method.
 *the variable dist determines the distance player travel when each button is pressed
 */
Player.prototype.movePlayer = function(x, y) {
    this.col = this.col + x;
    this.row = this.row + y;

    if (this.col > 5) {
        this.col = 1;
    }
    if (this.col < 1) {
        this.col = 5;
    }
};

/* updates player position to prevent player character from
   being able to move off of the board
 */
Player.prototype.update = function(dt) {
    this.x = (this.col - 1) * SPRITE_WIDTH;
    this.y = (this.row - 1) * SPRITE_HEIGHT - 40;
};

/* Draw the enemy on the screen
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* instantiates a Goal object
 */
goal = new Goal();

/* creates array to hold rock objects.
 * instantiates first rock
 */
var allRocks = [];
allRocks.push(new Rock());

/*creates array to store all Enemy objects
 */
var allEnemies = [];

/*creates a function to instantiate a new Enemy and add it to
 * allEnemies array
 */
function spawnEnemies() {
    allEnemies.push(new Enemy());
}

/*instantiates first enemy
 */
spawnEnemies();

/* new enemies will spawn in intervals between 1000 and 3000 ms
 */
window.setInterval(spawnEnemies, randomNumber(1000, 3000));

/* instatiates a new Player object
 */
var player = new Player();

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}, false);