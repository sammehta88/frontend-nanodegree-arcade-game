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
    var startRow = Math.floor(Math.random() * (5 - 2)) + 2;

    /* Sets initial location of enemy sprite to middle of the
     * random row above and off the left side of the canvas
     * Y location will not change from initial value since
     * enemies only move horizontally
     */
    //this.y = (startRow - 1) * (101 / 2);
    //this.y = 101*3/5;
    this.y = 51 + (startRow - 2) * 83;
    this.x = -101;

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
    this.x = 202;
    this.y = 606 - 3 * 83;
    //this.col =
}

    //takes key presses and changes position of player according to which
    //key is pressed.  sends either positive or negative x/y values to
    //playerMove method based on which direction the player is moving.

Player.prototype.handleInput = function(key) {
    console.log(key);
    var x = 0;
    var y = 0;

    if (key == 'left') {
        x = -1;
    }
    else if (key == 'right') {
        x = 1;
    }
    else if (key == 'up') {
        y = -1;
    }
    else {
        y = 1;
    }

    this.movePlayer(x,y);
}

/*sets new x and y location of player based off the values sent by the handleInput method.
 *the variable dist determines the distance player travel when each button is pressed
 */
Player.prototype.movePlayer = function(x,y) {
    var distY = 83;
    var distX = 101;
    this.x = this.x + distX * x;
    this.y = this.y + distY * y;
    console.log(x,y);
}

/* updates player position to prevent player character from
   being able to move off of the board
 */
Player.prototype.update = function(dt) {
    if (this.x < -16) {
        this.x = -16; //good
    }
    else if (this.x > 420) {
        this.x = 420; //good
    }
    else if (this.y > 400) {
        this.y = 400; //good
    }
    /*else if (this.y < 50) {
        this.y = 50; //good
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
var enemyMachine = window.setInterval(spawnEnemies, 3000);

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
