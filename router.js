import Game from "./game.js";

export default class Router {
  constructor(ws, games) {
    this.ws = ws;
    this.games = games;
    this.game = null;
    this.gameID = null;
    this.clientState = {};
  }
  actOn(message) {
    this.clientState = JSON.parse(message);
    console.log("Received: ", this.clientState);
    this[this.clientState.action]();

    console.log(this.gameID);
    console.log(this.games[this.gameID]);
    if (this.games[this.gameID]) {
      console.log(this.games[this.gameID].players);
      this.ws.send(
        "users" + JSON.stringify(Array.from(this.games[this.gameID].players))
      );
    }
    console.log(
      "sending message" + JSON.stringify(this.games[this.gameID], null, " ")
    );
    this.ws.send(JSON.stringify(this.games[this.gameID], null, " "));
  }

  none() {}

  join() {
    this.leave();
    this.gameID = this.clientState.gameID;
    this.playerName = this.clientState.playerName;

    if (this.gameID in this.games) {
      try {
        this.game = this.games[this.gameID];
        this.game.addPlayer(this.clientState.playerName);
      } catch (e) {
        console.log(e);
      }
    }
  }

  newGame() {
    this.leave();
    this.playerName = this.clientState.playerName;
    const host = this.clientState.playerName;
    // const newID = uuidv4();
    const newID = this.games.maxID + 1;

    this.games.maxID += 1;
    this.gameID = newID;
    this.game = new Game(newID, host);
    this.games[this.game.ID] = this.game;
  }

  leave() {
    console.log(`${this.playerName} disconnected`);
    if (this.gameID) {
      this.gameID = null;
      this.game.deletePlayer(this.playerName);
      this.game = null;
    }
  }
}
