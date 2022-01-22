import Game from './game.js';
import Score from './score.js';
import User from './user.js';

const addGameButton = () => {
  
  let newButton = document.createElement('button');
  newButton.innerText = "New Game";
  newButton.classList.add('game');

  newButton.addEventListener('click', e => {
    new Game
    Game.canvas.style.marginTop = '250px;'
    newButton.remove();
  });

  Game.canvas.parentNode.insertBefore(newButton, Game.canvas);
}

document.addEventListener("DOMContentLoaded", e =>{
  
  Score.fetchScores();
  User.getUsers();
  addGameButton();
})



