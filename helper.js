export default class Helper {

  static removeChildElements(parent) {
    if (parent.children.length > 0){
      for (let int = 0; int < parent.children.length; int++)
      {
        parent.removeChild(parent.children[int]);
      }
    } 
  }
  static createAlert(objectWithMessage = {
    message: "Error has occured."
  }) {
    const alert = document.getElementsByClassName('alert')[0]
    alert.classList.remove('hidden');
    alert.innerText = objectWithMessage.message
    setTimeout(e => {
      alert.classList.add('hidden')
    }, 7500)
  }
  
  static handleErrors(response){
    if (!response.ok)
      this.createAlert({
        message: response.statusText });
    else
      return response.json()
  }
}