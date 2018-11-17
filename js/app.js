class Enemy {
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        this.x += this.speed * dt;
        // if x is gerater than the length of the canvas, reset pos to -100
        if(this.x > 707){
            this.x = -100;
            //generate a random number for the speed
            let randomSpeed = Math.floor(Math.random() * 500);
            this.speed = 100 + randomSpeed;
        }

    }

    collision(){
        let playerMin = player.x - 75;
        let  playerMax = player.x + 75;
        if(this.y === player.y){
            if(this.x > playerMin && this.x < playerMax){
                player.x = 303;
                player.y = 490;

                return true;
            }
        }else if(player.y === -50){
            if(player.x !== goal.x){
                player.x = 303;
                player.y = 490;
                goal.x = goal.getStarXPos();
                return true;
            }
        }
            return false;
    }
    
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.lives = 3;
        this.isGameOver = false;
        this.points = 0;
        this.sprite = 0;
        this.hasWon = false;
        this.needsInfo = false;
    }

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
            this.isGameOver = true;
        }
    }

    changeChar(){
        if(this.sprite !== 4){
            this.sprite += 1;
        }else{
            this.sprite = 0;
        }
    }

    goalReached(){
        goal.x = goal.getStarXPos();
        this.x = 303;
        this.y = 490;
        this.hasWon = true;
    }

    // Drwa the player on the screen
    render(){
        ctx.drawImage(Resources.get(this.getCharacters()[this.sprite]), this.x, this.y);
    }

    handleInput(key){
        if(this.hasWon || this.isGameOver){
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
                this.changeChar();
            }else if(this.x === 603 && this.y === 490){
                this.needsInfo = true;
            }else{
                this.needsInfo = false;
            }
        }
    }

}

class Gem{
    constructor(x, y, value, sprite){
        this.x = x;
        this.y = y;
        this.value = value;
        this.sprite = sprite;
    }

    grabGem(){

        if(this.y === player.y && this.x === player.x){
            if(this.value !== 0){
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

class Goal{
    constructor() {
        this.x = this.getStarXPos();
        this.y = -12;
        this.sprite = 'images/Star.png';
    }

    getStarXPos(){
        const xPos = [3, 103, 203, 303, 403, 503, 603];
        
        return xPos[Math.floor(Math.random() * 7)];
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [],
      gems = [],
      player = new Player(303, 490, 50, 3),
      yPos = [40, 130, 220, 310],
      xPos = [3, 103, 203, 303, 403, 503, 603],
      goal = new Goal(),
      gemSprites = ['gem-blue', 'gem-orange', 'gem-green'];

let enemy,
    gem;

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
});
