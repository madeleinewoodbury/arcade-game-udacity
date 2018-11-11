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
                player.y = 400;
            }
        }
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
        this.sprite = 'images/char-boy.png';
    }

    update(){
        // Prevent player from moving off canvas
        if(this.y > 400){
            this.y = 400;
        }
        if(this.x < 3){
            this.x = 3;
        }
        if(this.x > 603){
            this.x = 603;
        }

        // When the player reaches the top of the canvas, reset player positon
        if(this.y === -50){
            this.y = 400;
            this.x = 303;
        }
    }

    // Drwa the player on the screen
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key){
        if(key === 'left'){
            this.x -= this.speed + 50;
        }else if(key === 'up'){ 
            this.y -= this.speed + 40;
        }else if(key === 'right'){
            this.x += this.speed + 50;
        }else if(key === 'down'){
            this.y += this.speed + 40;
        }
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [],
      player = new Player(303, 400, 50);

let enemy,
    enemyStartPos = [40, 130, 220];

enemyStartPos.forEach(function(y){
    let randomSpeed = 100 + (Math.floor(Math.random() * 500));
    enemy = new Enemy(0, y, randomSpeed);
    allEnemies.push(enemy);
});


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
