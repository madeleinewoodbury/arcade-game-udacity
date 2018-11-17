class Enemy {
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt){
        // Multiplying any movement by the dt parameter
        // will ensure the game runs at the same speed for all computers.

        this.x += this.speed * dt;
        // if x is gerater than the length of the canvas, reset pos to -100
        if(this.x > 707){
            this.x = -100;
            //generate a random number for the speed
            let randomSpeed = Math.floor(Math.random() * 500);
            this.speed = 100 + randomSpeed;
        }
    }

    // detect if the player collides with an enemy, or if the player ends up in the water
    collision(){
        let playerMin = player.x - 75;
        let  playerMax = player.x + 75;
        if(this.y === player.y){
            if(this.x > playerMin && this.x < playerMax){
                // if a collison occurs, reset the player to starting position
                player.x = 303;
                player.y = 490;

                // the player will loose a life
                return true;
            }
        }else if(player.y === -50){
            // if the player is in the water
            if(player.x !== goal.x){
                player.x = 303;
                player.y = 490;
                goal.x = goal.getStarXPos();

                // the player will loose a life
                return true;
            }
        }

        // no collisons, return false, no need to update lives
        return false;
    }
    
    // Draw the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

}

// The Player class: 
// This class requires an update(), render() and a handleInput() method.
class Player{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.lives = 3;
        this.isGameOver = false;
        this.points = 0;
        this.sprite = 0; // player sprite is set to first charcter in getCharacters
        this.hasWon = false;
        this.needsInfo = false;
    }

    // method to get a new character sprite
    getCharacters(){
        const characters = [
            'images/char-boy.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png',
            'images/char-cat-girl.png'
        ];

        return characters;
    }

    // update the player's movement
    update(){
        // Prevent player from moving off canvas
        if(this.y > 490){
            this.y = 490;
        }
        if(this.x < 3){
            this.x = 3;
        }
        if(this.x > 603){
            this.x = 603;
        }
        if(this.y < -50){
            this.y = -50;
        }

        // When the player reaches the top of the canvas, reset player positon
        if(this.y === -50 && this.x === goal.x){
                this.goalReached();
            }

    }

    updatePoints(val){
        this.points += val;
    }

    updateLives(val){
        this.lives += val;
        if(this.lives === 0){
            // no more lives
            this.isGameOver = true;
        }
    }

    // method to change the player sprite
    changeChar(){
        // if the player is set to the index of 4, the sprite will go back to index of 0
        if(this.sprite !== 4){
            this.sprite += 1;
        }else{
            this.sprite = 0;
        }
    }

    // The player wins ny reaching the star
    goalReached(){
        this.x = 303;
        this.y = 490;
        this.hasWon = true;
    }

    // Draw the player on the screen
    render(){
        // use the getCharcters method and the player sprite index to determine which character to draw
        ctx.drawImage(Resources.get(this.getCharacters()[this.sprite]), this.x, this.y);
    }

    handleInput(key){

        if(this.hasWon || this.isGameOver){
            // prevent the player from moving if the game is won or if game over
            this.x = 303;
            this.y = 490;
        }else{
            if(key === 'left'){
                this.x -= this.speed + 50;
            }else if(key === 'up'){ 
                this.y -= this.speed + 40;
            }else if(key === 'right'){
                this.x += this.speed + 50;
            }else if(key === 'down'){
                this.y += this.speed + 40;
            }

            if(this.x === 3 && this.y === 490){
                // if the player is in the selector box, change character index
                this.changeChar();
            }else if(this.x === 603 && this.y === 490){
                // if the player is on the question mark, set needsInfo to true to show
                // game instructions modal
                this.needsInfo = true;
            }else{
                // reset the needsInfo boolean when player steps off the question mark
                this.needsInfo = false;
            }
        }
    }

}

// Gem class for gems and hearts
class Gem{
    constructor(x, y, value, sprite){
        this.x = x;
        this.y = y;
        this.value = value;
        this.sprite = sprite;
    }

    grabGem(){
        // if the player's position matches the gem's position
        if(this.y === player.y && this.x === player.x){
            if(this.value !== 0){
                // if the gem's value is more than 0, update player's points
                player.updatePoints(this.value);
            }
            return true;
        }else{
            return false;
        }
    };

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

}

// Goal class for the star
class Goal{
    constructor() {
        this.x = this.getStarXPos();
        this.y = -12;
        this.sprite = 'images/Star.png';
    }

    // set a new star position at the beginning of a new game
    getStarXPos(){
        const xPos = [3, 103, 203, 303, 403, 503, 603];
        return xPos[Math.floor(Math.random() * 7)];
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

// Instantiate the objects.
const allEnemies = [],
      gems = [],
      player = new Player(303, 490, 50, 3),
      goal = new Goal();

// Game variables
const yPos = [40, 130, 220, 310],
      xPos = [3, 103, 203, 303, 403, 503, 603],
      gemSprites = ['gem-blue', 'gem-orange', 'gem-green'];

let enemy,
    gem;

// Instantiate a new enemy for each yPos
yPos.forEach(function(y){
    let randomSpeed = 100 + (Math.floor(Math.random() * 500));
    enemy = new Enemy(0, y, randomSpeed);
    allEnemies.push(enemy);
});

// Generate 50 gems
for(let i = 0; i < 50; i++){
    let gemX = xPos[Math.floor(Math.random() * 7)];
    let gemY = yPos[Math.floor(Math.random() * 4)];
    let gemSprite;
    let gemValue;

    // Every 10 gem will be a heart
    if(i % 10 === 0){
        gemSprite = 'images/heart.png';
        gemValue = 0;
    }else{
        gemSprite = `images/${gemSprites[Math.floor(Math.random() * 3)]}.png`;
        gemValue = 50;
    }
    gem = new Gem(gemX, gemY, gemValue, gemSprite);
    gems.push(gem);
}

// This listens for key presses and sends the keys to 
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
