import Player from './player.js';
import Enemy from './enemy.js';


export default class Game {
  static canvas = document.getElementById('gameBackground');
  static ctx = Game.canvas.getContext('2d');
  static dx = 8;
  static dy = 8;
  static player = new Player();
  static enemies = [ new Enemy, new Enemy(280, 100, 15)];
  static restartBox = { x: Game.canvas.width / 2 - 40,
                      y: Game.canvas.height - 90,
                      width: 80,
                      height: 30
                    }
  static winBox = { x: Game.canvas.width - 20,
                    y: Game.canvas.height - 20,
                    width: 10,
                    height: 10
                  }
  static over = false;
  static level = 1;
  static tick = 1;
  constructor() {
    Game.draw();
  }

  static restart = (newLevel = 1) => {
    this.player = new Player
    switch (newLevel) 
    {
      case 1: {
        this.enemies = [new Enemy, new Enemy(280, 100, 15)];
        break;
      }
      case 2: {
        this.enemies = [new Enemy(10, 60, 15), new Enemy(250, 110, 15), new Enemy(250, 150, 30), new Enemy(200, 200, 30) ]
        break;  
      }
      case 3: {
        this.enemies = [new Enemy(10 * this.level, 60 * this.level, 15), new Enemy(250 * (1/4 * this.level), 110 * (1/4 * this.level), 15), new Enemy(250 * (1/4 * this.level), 150 * (1/4 * this.level), 30), new Enemy(200 * (1/4 * this.level), 200 * (1/4 * this.level), 30) ]
        break;
      }
    }
    this.over = false;
    this.level = newLevel;
    this.draw();
  }
  static draw = () => { 
    const ctx = this.ctx;
    const deltaTime = setTimeout(this.draw, 30);
    let collision = this.collision();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayer();
    this.drawEnemy();
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.fillRect(this.winBox.x, this.winBox.y, this.winBox.width, this.winBox.height);
    ctx.closePath();
    Game.tick === 3 ? Game.movement() : Game.tick += 1;
    if (collision){
      clearInterval(deltaTime);
      if (collision.type === "enemy") {
        this.over = true;
        this.gameOver();
      } else if (collision.type === "win") {
        this.over = true;
        this.nextLevelScreen();
      }
    }
    else if (!this.over) {
      deltaTime;
    }
  }

  // static save = name => {
  //   fetch(indexUrl + `/users/${name}/scores`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "Access-Control-Allow-Origin": '*'
  //   },
  //   method: "POST",
  //   body: JSON.stringify({
  //           score: Game.level })
  
  //   }).
  //   then(resp => resp.json()).
  //   then(json => {
  //     const user = User.findById(json.data.attributes.user_id);
  //     user.scores.push(Score.fromJson(json.data))
  //   }).
  //   catch(error => console.log(error))
  // }
  static movement() {
    document.addEventListener('keydown', this.player.move)
    Game.tick = 1;
    for (const enemy of this.enemies) {
      enemy.move();
    }
  }
  static gameOver = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillRect(this.restartBox.x, this.restartBox.y, this.restartBox.width, this.restartBox.height)
    ctx.font = '20px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Restart", this.restartBox.x + this.restartBox.width / 2, this.restartBox.y + this.restartBox.height / 1.5);
    ctx.font = '30px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height * 0.25)
    ctx.closePath();
    this.canvas.addEventListener('click', this.gameOverEvent)
  }

  static gameOverEvent = (e) => {
      let coords = this.coordsInCanvas(e.clientX, e.clientY);
      if (this.collisionWithRestart(coords, this.restartBox)) {
        this.canvas.removeEventListener('click', this.gameOverEvent);
        const userName = document.getElementById('user-hover')
        // if (userName)
        //   this.save(userName.innerText);
        this.restart();
      }
      else
        this.canvas.addEventListener('click', this.gameOverEvent);
  }

  static nextLevelScreen = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillRect(this.restartBox.x, this.restartBox.y, this.restartBox.width, this.restartBox.height)
    ctx.font = '20px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "blue";
    ctx.fillText("Next", this.restartBox.x + this.restartBox.width / 2, this.restartBox.y + this.restartBox.height / 1.5);
    ctx.font = '30px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.fillText("Congrats!", this.canvas.width / 2, this.canvas.height * 0.25)
    ctx.closePath();
    this.canvas.addEventListener('click', this.nextLevelEvent)
  }

  static nextLevelEvent = (e) => {
    let coords = this.coordsInCanvas(e.clientX, e.clientY);
    if (this.collisionWithRestart(coords, this.restartBox)) {
      this.canvas.removeEventListener('click', this.nextLevelEvent)
      this.level += 1;
      this.restart(this.level);

    }
    else
      this.canvas.addEventListener('click', this.nextLevelEvent);
  } 
  static drawEnemy = (interval) => {
    const ctx = this.ctx;
    for (let enemy of this.enemies){
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x, enemy.y, enemy.lw, enemy.lw);
      ctx.closePath();
    }

  }

  static drawPlayer = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }

  static collision = () => {

    const collisionWithEnemy = () => {

      for (let enemy of this.enemies){

        if (this.player.x + this.player.radius > enemy.x 
          && this.player.y > enemy.y 
          && this.player.x - this.player.radius < enemy.x + enemy.lw 
          && this.player.y - this.player.radius < enemy.y + enemy.lw) {
            this.over = true;
            return true;
        }

      }
    }
    
    const collisionWithWin = () => {
      if (this.player.x > this.winBox.x && this.player.y > this.winBox.y){
        this.over = true;
        return true;
      }
    }

    if (collisionWithEnemy()) return { type: "enemy" }
    else if (collisionWithWin()) return { type: "win" }
    else return null
    
  }



  static collisionWithRestart = (coords, restartBox) => {
    let boundRect = this.canvas.getBoundingClientRect();
    let boxCoords = this.coordsInCanvas(restartBox.x + boundRect.left, restartBox.y + boundRect.top);
    if (coords.x < boxCoords.x + restartBox.width &&
      coords.x > boxCoords.x &&
      coords.y < boxCoords.y + restartBox.height &&
      coords.y > boxCoords.y)
      return true;
  }

  static collisionWithWin() {
    if (this.player.x > this.winBox.x && this.player.y > this.winBox.y){
      return true;
    }
  }

  static coordsInCanvas = (clientX, clientY) => {
    let boundRect = this.canvas.getBoundingClientRect();
    return { x: clientX - boundRect.left * (this.canvas.width / boundRect.x),
            y: clientY - boundRect.top * (this.canvas.height / boundRect.y)
    }
    
  }
}
