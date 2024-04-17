export default class Game {
  constructor(ID, host) {
    this.ID = ID;
    this.host = host;
    this.players = new Set();
    this.players.add(host);
  }

  addPlayer(name) {
    if (!this.players.has(name)) {
      this.players.add(name);
      console.log(`Player ${name} joined to the game ${this.ID}`);
      console.log(this);
      //   return this;
    } else {
      throw new Error("player name already used");
    }
  }

  deletePlayer(name) {
    this.players.delete(name);
    console.log(`Player ${name} leaved the game ${this.ID}`);
    console.log(this);
  }
}
