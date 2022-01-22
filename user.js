import Helper from './helper.js';
import Score from './score.js';
const indexUrl = "https://basic-game-api.herokuapp.com/";

export default class User {
  static current_user;
  static all = [];
  constructor(id, name = "Example") {
    this.id = parseInt(id, 10);
    this.name = name;
    this.scores = Score.all.filter(e => e.user_id === this.id).sort((a, b) => b.score - a.score).slice(0,9);
    User.all.push(this);
    
    this.renderScores = () => {
      const userScoreDiv = document.getElementsByClassName('user-score overlay')[0];
      userScoreDiv.classList.remove('hidden'); 

      if (this.scores.length >= 1) {  
        const ul = document.createElement('ul');
        const userScores = this.scores;
        const scoreText = userScores.map( e => `${this.name} has scored ${e.score}.`);
        for(const text of scoreText) {
          const li = document.createElement('li');
          li.innerText = text;
          ul.appendChild(li);
        }
        userScoreDiv.appendChild(ul);
      } else
        userScoreDiv.innerText = "No Scores Recorded Yet!"

      userScoreDiv.addEventListener('mouseleave', e => {
        userScoreDiv.classList.add('hidden');
      })
    }

    this.createUserButtons = () => {

      const userEditFormEvent = (e) => {
        const sessionDiv = document.getElementsByClassName('user')[0];
        const editForm = document.createElement('form');
        const nameInput = document.createElement('input');
        const nameSubmit = document.createElement('input');
        nameInput.type = "text";
        nameInput.placeholder = `${this.name}`;
        nameSubmit.type = "submit";
        nameSubmit.value = "Change Name";
        nameInput.classList.add('edit');
        nameSubmit.classList.add('edit');
        editForm.appendChild(nameInput);
        editForm.appendChild(nameSubmit);
        editForm.addEventListener('submit', User.updateUser);
        sessionDiv.appendChild(editForm);
      }
  
      const createEditButton = () => {
        let editButton = document.createElement('button');
        editButton.classList.add('user');
        editButton.innerText = `Edit ${this.name}`;
        editButton.addEventListener('click', userEditFormEvent);
        return editButton;
      }
  
      const createDeleteButton = () => {
        function destroyConfigObj() {

          return {
        
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": '*' 
            },
            method: "DELETE"
          }
          
        }
      
        let userName = this.name;
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('user', 'delete');
        deleteButton.innerText = `Delete ${userName}`;
        deleteButton.addEventListener('click', e => {      
          fetch(indexUrl + `users/${this.id}`, destroyConfigObj()).then(resp => resp.json()).then(json => {
              Helper.createAlert(json);
              document.getElementsByClassName('user overlay')[0].classList.add('hidden');
              User.removeFromAll(userName);
          })
        })
        return deleteButton;
        
    
      }
  
      return {
        deleteButton: createDeleteButton(),
        editButton: createEditButton()
      }
  
    }
    
    this.renderProfile = (e) => {
      const profileOverlay = document.getElementsByClassName('overlay user')[0];
      profileOverlay.classList.remove('hidden');
      const buttons = this.createUserButtons();
      for (const button in buttons){
        profileOverlay.appendChild(buttons[button]);
      }
      profileOverlay.addEventListener('mouseleave', e=> {
        profileOverlay.innerText = "";
        profileOverlay.classList.add('hidden')
      })

    }
    
    this.logout = (e) => {
      const headerUl = document.getElementsByClassName('header')[1]
      const highscoreLi = headerUl.children[0];
      document.getElementsByClassName('user-score overlay')[0].innerText = '';
      headerUl.innerText = "";
      let loginLi = document.createElement('li');
      loginLi.id = "login-hover";
      loginLi.innerText = "Login";
      headerUl.appendChild(highscoreLi);
      headerUl.appendChild(loginLi);
      User.loadLoginEvent();
    }

    this.login = () => {
      User.current_user = this;
      const header = document.getElementsByClassName('header')[0]
      const [userLi, scoresLi, logoutLi, ul] = [ document.createElement('li'),
      document.createElement('li'),
      document.createElement('li'),
      header.children[0] ];
      ul.children[1].remove();
      userLi.id = 'user-hover';
      userLi.setAttribute('data-id', this.id);
      scoresLi.id = 'scores-hover';
      scoresLi.setAttribute('data-user', this.id);
      logoutLi.id = 'logout';
      logoutLi.setAttribute('data-id', this.id)
      userLi.innerText = this.name;
      scoresLi.innerText = `${this.name}'s Scores`;
      logoutLi.innerText = "Logout";
      scoresLi.addEventListener('click', this.renderScores)
      userLi.addEventListener('click', this.renderProfile)
      logoutLi.addEventListener('click', this.logout)
      ul.appendChild(scoresLi);
      ul.appendChild(userLi);
      ul.appendChild(logoutLi);
    }

  }

  static fromJson(json) {
    let user = User.all.find(e => parseInt(json.data.id, 10) === e.id)
    if (!user)
      return new User(json.data.id, json.data.attributes.name) 
    else
    {
      if(user.name === json.data.attributes.name)
        return user;
      else {
        User.removeFromAll(user.name)
        return new User(json.data.id, json.data.attributes.name)
      }
    }
    
  }

  static findById = id => User.all.find(e => id === e.id);

  static getUsers() {
    fetch(indexUrl + "users", {
      headers: {
        "Access-Control-Allow-Origin": '*'
      }
    }).then(resp => Helper.handleErrors(resp)).then(json => {
      if (json.message)
      Helper.createAlert(json)
      else {
        json.data.forEach(e =>{
          new User(e.id, e.attributes.name)
        }); 
      }   
    }).catch(error => console.log("Unable to retrieve the users. Reason: " + error.message))
    User.loadLoginEvent();
  }

  static loadLoginEvent(){

    document.getElementById('login-hover').addEventListener('click', e => {
      let loginDiv = document.getElementsByClassName('login overlay')[0];
      loginDiv.classList.remove('hidden');
      loginDiv.addEventListener('mouseleave', e => {
        document.getElementsByClassName('overlay login')[0].classList.add('hidden');
      })
    })

    document.getElementsByClassName('user')[1].addEventListener("submit", User.login)
  }

  static removeFromAll(name) {
    User.all = User.all.filter(e => {
      if (e.name !== name){
        e.logout();
        return e; 
      }
    })

  }

  static updateUser(e) {
    e.preventDefault();

    const updateConfigObj = (name = "") => {
      return {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  "Access-Control-Allow-Origin": '*'
                },
                method: "PATCH",
                body: JSON.stringify({
                      user: {
                              name: name
                      }})
              }
    }

    let newName;
    const uOverlay = document.getElementsByClassName('user overlay')[0];
    const dataId = document.getElementById('user-hover').getAttribute('data-id');
    for (let input of e.target.children) {
      if (input.type === "text") {
        newName = input.value;
      }
    }
    const updateAfterFetch = json => {
        if (json.message)
          Helper.createAlert(json)
        else {
          uOverlay.classList.add('hidden');
          User.fromJson(json).login();
        }
    }

    fetch(indexUrl + `users/${dataId}`, updateConfigObj(newName)).
    then(resp => Helper.handleErrors(resp)).
    then(json => updateAfterFetch(json))
  }

  static login(e) {

    e.preventDefault()
    const createConfigObj = (userName) => {
      return {
    
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": '*'
      },
      method: "POST",
      body: JSON.stringify({
              user: {
                      name: userName
              }})
      }
    }
    let userName;
    for (let child of e.target.children){ 
      if ( child.classList.value === "user-name" )  {
          userName = child.value;
      }
    }
    
    if (userName && userName !== '') {
      fetch(indexUrl + `users`, createConfigObj(userName)).then(resp => Helper.handleErrors(resp)).then(json => {
        if (json.message)
          Helper.createAlert(json)
        else {
          User.fromJson(json).login()
          document.getElementsByClassName('overlay login')[0].classList.add('hidden');
        }
      });
    }
    else
    {
      Helper.createAlert({
        message: "You must provide a username!"
      })
    }
  }

  



 
}