import Helper from './helper.js';
import User from './user.js';
const indexUrl = "https://basic-game-api.herokuapp.com/";

export default class Score {
  static all = [];
  constructor(id, score, user_id) {
    this.id = parseInt(id, 10);
    this.score = parseInt(score, 10);
    this.user_id = parseInt(user_id, 10);
    Score.all.push(this);
  }
  static fromJson(info) {
    return new Score(info.id, info.attributes.score, info.attributes.user_id);
  }
  static fetchScores() {
    fetch(indexUrl + "scores").
    then(resp => Helper.handleErrors(resp)).then(json => {
      json.data.forEach(e => {
        Score.fromJson(e);
      });
    }).catch(error => console.log(error));
    this.loadHighscoreEvent();
  }
  static bestTenScores() {
    const inDescending = Score.all.sort(function(a, b){return b.score - a.score})
    return inDescending.slice(0, 9);
    
  }
  static renderHighScores() {
    let bestScores = this.bestTenScores()
    const highscoreDiv = document.getElementsByClassName('highscore overlay')[0];
    highscoreDiv.innerText = "Highscores";
    const ul = document.createElement('ul');
    bestScores.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('highscore-actual');
      li.innerText = `${User.findById(e.user_id).name} has a high score of ${e.score}`;
      ul.appendChild(li);
    })
    Helper.removeChildElements(highscoreDiv);
    highscoreDiv.appendChild(ul);
  }
  static loadHighscoreEvent() {
    const hs = document.getElementById("highscore-hover");
    hs.addEventListener("click", e => {
      const hsOverlay = document.getElementsByClassName('hidden overlay highscore')[0];
      hsOverlay.classList.remove("hidden");
      Score.renderHighScores()
      hsOverlay.addEventListener("mouseleave", e=> {
          hsOverlay.classList.add("hidden");
      })
    })
  }

}