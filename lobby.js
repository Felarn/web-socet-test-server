import { v4 as uuidv4 } from "uuid";

export default class Lobby {
  constructor(ID, host) {
    this.ID = ID;
    this.host = host.name;
    this.players = [];
    // this.players = new PlayerList();
    this.addPlayer(host);
    this.isStarted = false;
  }

  // ____ манипуляции со списком игроков в лобби _______________
  hasPlayer(playerToChek) {
    return this.players.some((playerInLobby) => playerInLobby == playerToChek);
  }

  addPlayer(player) {
    if (!this.hasPlayer(player)) {
      this.players.push(player);
      this.sendTextToAll(player + " joined");
      this.updateClients();
      this.sendTextToAll("game ID is: " + this.ID);
    }
  }

  deletePlayer(playerToDelete) {
    this.players = this.players.filter(
      (playerInLobby) => playerToDelete != playerInLobby
    );
    this.sendTextToAll(playerToDelete + " disconnected");
    this.updateClients();
  }

  listNames() {
    return this.players.map((player) => player.name);
  }

  updateClients() {
    this.sendObjToAll({ type: "player-list", playerList: this.listNames() });
  }

  sendObjToAll(object) {
    this.players.forEach((player) => player.sendObj(object));
  }

  sendTextToAll(text) {
    this.players.forEach((player) => player.sendTextMessage(text));
  }

  toString() {
    return JSON.stringify({ ID: this.ID, player: this.listNames() });
  }
}
