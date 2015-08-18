var spriteWidth = 101;
var spriteHeight = 83;

//creates Goal class which spawns on a random square.
//goal of game is to push rock into the Goal.
var Goal = function() {
    this.sprite = 'images/selector.png';
    this.col = Math.floor(Math.random() * (6 - 1)) + 1;
    this.row = Math.floor(Math.random() * (7 - 2)) + 2;
    this.activated = false;
}

Goal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Goal.prototype.update = function() {
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 40;
}

goal = new Goal;

//create rock class which can block enemies
var Rock = function() {

    this.sprite = 'images/rock.png';
    this.col = Math.floor(Math.random() * (6 - 1)) + 1;
    this.row = 5;
    this.finalSlot = 0;
}

Rock.prototype.update = function(dt) {

    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 40;
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Rock.prototype.moveRock = function(x,y) {

    if (this.col == player.col && this.row == player.row) {

        this.col = this.col + x;
        this.row = this.row + y;

        /*if (this.row == 2 && y !== 0) {
            player.row = 3;
        }
        else if (this.row == 6  && y !== 0) {
            player.row = 5;
        } else {
            this.col = this.col + x;
            this.row = this.row + y;
        }*/
        if (this.col < 1) {
            this.col = 5;
        }
        if (this.col > 5) {
            this.col = 1;
        }
        if (this.row == 1) {
            if (emptySlots[this.col - 1] == 0) {
                this.row = 1;
                player.row = 2;
                emptySlots[this.col - 1] = 1;
            /*allRocks.forEach(function(rock) {
                if (rock.finalSlot )
            //if (checkEmptySlot(this.col)) {
                this.row = 1;
                player.row = 2;
                this.finalSlot = this.col;
            //} else {
            //    this.row = 2;
            //    player.row = 3;
            //}*/
            } else {
                this.row = 2;
                player.row = 3;
            }
        }
        if (this.row > 6) {
            this.row = 6;
            player.row = 5;
        }
    }
}

var checkEmptySlot = function(col) {
    allRocks.forEach(function(rock) {
        if (rock.finalSlot != 0) {
            if (rock.finalSlot == col) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    });
}

var allRocks = [];
allRocks.push(new Rock);
var emptySlots = [0,0,0,0,0];
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    /* Generate random integer between 2-4 to set starting row of enemy
     * Followed mozilla developer network's examples on Math.random()
     * Used Math.floor to ensure uniform distribution
     */
    this.row = Math.floor(Math.random() * (5 - 2)) + 2;
    this.col = -1;
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 40;
    /* Sets initial location of enemy sprite to middle of the
     * random row above and off the left side of the canvas
     * Y location will not change from initial value since
     * enemies only move horizontally
     */
    //this.y = (startRow - 1) * (101 / 2);
    //this.y = 101*3/5;
    //this.y = 51 + (startRow - 2) * 83;

    /* Generates random integer between 1 and 4 to use as speed multiplier.
     * Included in constructor function since each enemy should move
     * at a constant speed, so only want the speed multiplier to be
     * generated once per instance of Enemy
     */
     this.speed = Math.floor(Math.random() * (5 - 1)) + 1;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt * 100;

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // The image/sprite for our players, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-cat-girl.png';

    //sets initial location of player which is bottom row, middle column
    this.col = 3;
    this.row = 6;
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 40;
    //this.col =
}

    //takes key presses and changes position of player according to which
    //key is pressed.  sends either positive or negative x/y values to
    //playerMove method based on which direction the player is moving.

Player.prototype.handleInput = function(key) {
    var x = 0;
    var y = 0;

    if (key == 'left') {// && this.col > 1) {
        //this.col = this.col - 1;
        x = -1;
    }
    else if (key == 'right') {// && this.col < 5) {
        //this.col = this.col + 1;
        x = 1;
    }
    else if (key == 'up' && this.row > 2) {
        //this.row = this.row - 1;
        y = -1;
    }
    else if (key == 'down' && this.row < 6) {
        //this.row = this.row + 1;
        y = 1;
    }

    this.movePlayer(x,y);

    allRocks.forEach(function(rock) {
        rock.moveRock(x,y);
    });
}

/*sets new x and y location of player based off the values sent by the handleInput method.
 *the variable dist determines the distance player travel when each button is pressed
 */
Player.prototype.movePlayer = function(x,y) {
    this.col = this.col + x;
    this.row = this.row + y;

    if (this.col > 5) {
        this.col = 1;
    }
    if (this.col < 1) {
        this.col = 5;
    }
}

/* updates player position to prevent player character from
   being able to move off of the board
 */
Player.prototype.update = function(dt) {
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 40;

/*    if (this.col < 1) {
        this.col = 1;
    }
    else if (this.col > 5) {
        this.col = 5;
    }
    else if (this.row > 6) {
        this.row = 6;
    }
    else if (this.row < 2) {
        this.row = 2; //good
    }*/
}

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// creates array to store all Enemy objects
var allEnemies = [];

//creates a function to instantiate a new Enemy and add it to
//the allEnemies array

function spawnEnemies () {
    allEnemies.push(new Enemy);
}

//instatiates first enemy
spawnEnemies();

//new enemies will spawn every 1500 ms
var enemyMachine = window.setInterval(spawnEnemies, 2000);

//instatiates a new Player object
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}, false);
