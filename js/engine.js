/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
            /* Predefine the variables we'll be using within this scope,
             * create the canvas element, grab the 2D context for that canvas
             * set the canvas elements height/width and add it to the DOM.
             */
            var doc = global.document,
                win = global.window,
                canvas = doc.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                lastTime;

            canvas.width = 505;
            canvas.height = 606;
            doc.body.appendChild(canvas);

            /* This function serves as the kickoff point for the game loop itself
             * and handles properly calling the update and render methods.
             */
            function main() {
                /* Get our time delta information which is required if your game
                 * requires smooth animation. Because everyone's computer processes
                 * instructions at different speeds we need a constant value that
                 * would be the same for everyone (regardless of how fast their
                 * computer is) - hurray time!
                 */
                var now = Date.now(),
                    dt = (now - lastTime) / 1000.0;

                /* Call our update/render functions, pass along the time delta to
                 * our update function since it may be used for smooth animation.
                 */
                update(dt);
                render();

                /* Set our lastTime variable which is used to determine the time delta
                 * for the next time this function is called.
                 */
                lastTime = now;

                /* Use the browser's requestAnimationFrame function to call this
                 * function again as soon as the browser is able to draw another frame.
                 */
                win.requestAnimationFrame(main);
            }

            /* This function does some initial setup that should only occur once,
             * particularly setting the lastTime variable that is required for the
             * game loop.
             */
            function init() {
                reset();
                lastTime = Date.now();
                main();
            }

            /* This function is called by main (our game loop) and itself calls all
             * of the functions which may need to update entity's data.
             */
            function update(dt) {
                updateEntities(dt);
                checkCollisions();
            }

            /* This is called by the update function  and loops through all of the
             * objects within your allEnemies array as defined in app.js and calls
             * their update() methods. It will then call the update function for your
             * player object. These update methods should focus purely on updating
             * the data/properties related to  the object. Do your drawing in your
             * render methods.
             */
            function updateEntities(dt) {
                allEnemies.forEach(function(enemy) {
                    enemy.update(dt);
                });
                player.update(dt);
                allRocks.forEach(function(rock) {
                    rock.update(dt);
                });
                goal.update();
            }

            /* This function initially draws the "game level", it will then call
             * the renderEntities function. Remember, this function is called every
             * game tick (or loop of the game engine) because that's how games work -
             * they are flipbooks creating the illusion of animation but in reality
             * they are just drawing the entire screen over and over.
             */
            function render() {
                /* This array holds the relative URL to the image used
                 * for that particular row of the game level.
                 */
                var rowImages = [
                        'images/water-block.png', // Top row is water
                        'images/stone-block.png', // Row 1 of 3 of stone
                        'images/stone-block.png', // Row 2 of 3 of stone
                        'images/stone-block.png', // Row 3 of 3 of stone
                        'images/grass-block.png', // Row 1 of 2 of grass
                        'images/grass-block.png' // Row 2 of 2 of grass
                    ],
                    numRows = 6,
                    numCols = 5,
                    row, col;

                /* Loop through the number of rows and columns we've defined above
                 * and, using the rowImages array, draw the correct image for that
                 * portion of the "grid"
                 */
                for (row = 0; row < numRows; row++) {
                    for (col = 0; col < numCols; col++) {
                        /* The drawImage function of the canvas' context element
                         * requires 3 parameters: the image to draw, the x coordinate
                         * to start drawing and the y coordinate to start drawing.
                         * We're using our Resources helpers to refer to our images
                         * so that we get the benefits of caching these images, since
                         * we're using them over and over.
                         */
                        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                    }
                }

                /* draws white rectangle on top of canvas to counteract the transparency
                 * above the top of the tiles.
                 */
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 505, 50);

                /* Calls function to all characters/items on the board
                 */
                renderEntities();

                /* Calls function to check whether win condition has been met
                 * only does this if all rocks needed for the win have already been
                 * generated
                 */
                if (allRocks.length == 5) {
                    checkWin();
                }
            }

            /* This function is called by the render function and is called on each game
             * tick. It's purpose is to then call the render functions you have defined
             * on your enemy and player entities within app.js
             */
            function renderEntities() {
                goal.render();
                /* Loop through all of the objects within the allEnemies array and call
                 * the render function you have defined.
                 */
                allEnemies.forEach(function(enemy) {
                    enemy.render();
                });

                /* loops through all objects within allRocks array and calls render function.
                 * renders player first if player is above (behind) the rock
                 * renders rock first if it is above (behind) the player
                 */
                allRocks.forEach(function(rock) {
                    if (rock.y < player.y) {
                        rock.render();
                        player.render();
                    } else {
                        player.render();
                        rock.render();
                    }
                });
            }

            /* For win to occur, a rock needs to be in each column on the top row
             * loops through emptySlots and adds each value together. If a rock
             * is in the column then the value is a 1.  If sum == 5 then win condition
             * has been met and 'you win' message appears
             */
            function checkWin() {
                var length = emptySlots.length;
                var total = 0;

                for (slot = 0; slot < length; slot++) {
                    total = total + emptySlots[slot];
                }

                if (total == 5) {
                    ctx.font = "bold 36px sans-serif";
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 171, 505, 342);
                    ctx.fillStyle = "black";
                    ctx.fillText("Congratulations, You Win!", 25, 325);
                }
            }

            /* resets game after a loss
             */
            function reset() {
                player = new Player();
                allEnemies = [];
                goal = new Goal();
                allRocks = [];
                allRocks.push(new Rock());
                emptySlots = [0, 0, 0, 0, 0];
            }

            /* function to check whether an enemy has hit a player or a rock
             * loops through each enemy and checks whether it is within a set distance from the
             * player object.  If so, the reset function is called
             */
            function checkCollisions() {
                allEnemies.forEach(function(enemy) {
                    if (enemy.col == player.col && enemy.row == player.row) {
                        reset();
                    }

                    /* loops through each rock object and checks whether it is within set distance of the enemy object
                     * if so, reverses direction of enemy and changes enemy sprite to a reflected image
                     */
                    allRocks.forEach(function(rock) {
                        if (rock.row == enemy.row && rock.col == enemy.col) {
                            if (enemy.direction == 'right') {
                                enemy.speed = -1 * enemy.speed;
                                enemy.direction = 'left';
                                enemy.sprite = 'images/enemy-bug-reflect.png';
                            } else {
                                enemy.direction = 'right';
                                enemy.sprite = 'images/enemy-bug.png';
                                enemy.speed = -1 * enemy.speed;
                            }
                        }
                    });
                });
            }

                /* Go ahead and load all of the images we know we're going to need to
                 * draw our game level. Then set init as the callback method, so that when
                 * all of these images are properly loaded our game will start.
                 */
                Resources.load([
                    'images/stone-block.png',
                    'images/water-block.png',
                    'images/grass-block.png',
                    'images/enemy-bug.png',
                    'images/enemy-bug-reflect.png',
                    'images/char-cat-girl.png',
                    'images/Rock.png',
                    'images/Selector.png'
                ]);
                Resources.onReady(init);

                /* Assign the canvas' context object to the global variable (the window
                 * object when run in a browser) so that developer's can use it more easily
                 * from within their app.js files.
                 */
                global.ctx = ctx;
            })(this);