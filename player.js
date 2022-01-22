
export default class Player {
  static current_player;

  constructor(x = 8, y = 8, radius = 4, mvAmnt = 8) {
    this.x = x;
    this.y = y;
    this.dx = mvAmnt;
    this.dy = mvAmnt;
    this.radius = radius;
    Player.current_player = this;
  }

  move(e) {
    switch(e.keyCode){
      case(37):
      case (65): {
        if (Player.current_player.x > 8)
          Player.current_player.x -= Player.current_player.dx;
        break;
      }
      case(39):
      case(68): {
        if (Player.current_player.x < 472)
          Player.current_player.x += Player.current_player.dx;
          break;
      }
      case(38):
      case(87): {
        if (Player.current_player.y > 8)
          Player.current_player.y -= Player.current_player.dy;
          break;
      }
      case(40):
      case(83): {
        if (Player.current_player.y < 312)
          Player.current_player.y += Player.current_player.dy;
          break;
      }
    }
  }
}