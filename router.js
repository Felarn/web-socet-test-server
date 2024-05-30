import Lobby from "./lobby.js";
import Player from "./player.js";

export default class Router {
  constructor(ws, games) {
    this.ws = ws;
    this.games = games;
    this.game = null;
    this.gameID = null;
    this.clientState = {};
    this.player = new Player("anon", ws);
  }

  actOn(message) {
    this.clientState = JSON.parse(message);
    console.log("\x1b[36m" + "Received: ", this.clientState);
    try {
      this[this.clientState.action]();
    } catch (e) {
      console.log(e);
    }
    this.game &&
      console.log(
        "game ID:" + this.gameID + "| players: " + this.game.listNames()
      );
  }

  none() {}

  newGame() {
    this.leave();
    this.player.rename(this.clientState.playerName);
    const host = this.player;
    // const newID = uuidv4();
    const newID = this.games.maxID + 1;

    this.games.maxID += 1;
    this.gameID = newID;
    this.game = new Lobby(newID, host);
    this.games[this.game.ID] = this.game;
    this.printGames();
  }

  join() {
    this.leave();
    const joinToID = this.clientState.gameID;
    const playerName = this.clientState.playerName;

    if (joinToID in this.games && !this.games[joinToID].hasPlayer(playerName)) {
      try {
        this.gameID = joinToID;
        this.game = this.games[this.gameID];
        this.game.addPlayer(this.player);
        this.player.rename(playerName);
        this.printGames();
      } catch (e) {
        console.log(e);
      }
    }
  }

  leave() {
    console.log(`${this.player.name} left game`);
    if (this.gameID !== null) {
      this.gameID = null;
      console.log(this.game);
      this.game.deletePlayer(this.player);
      this.game = null;
    }
    this.printGames();
    // console.log(this.games);
  }

  chat() {
    const text = `${this.player.name}: ${this.clientState.chatMessage}`;
    console.log(text);
    this.game.sendTextToAll(text);
  }

  printGames() {
    // console.log("Games:" + JSON.stringify(this.games));
    console.log("Games:");
    console.log(this.games);
  }
}
