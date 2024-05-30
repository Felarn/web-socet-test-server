export default class Player {
  constructor(name, webSocket) {
    this.name = name;
    this.sessions = [webSocket];
  }

  reconnect(webSocket) {
    this.sessions.push(webSocket);
  }

  rename(newName) {
    this.name = newName;
  }

  sendTextMessage(text) {
    this.sendObj({ type: "chat", chatMessage: text });
  }

  sendObj(obj) {
    this.sessions.at(-1).send(JSON.stringify(obj));
  }

  valueOf() {
    return this.name;
  }
}
