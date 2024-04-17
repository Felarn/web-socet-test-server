import { WebSocketServer } from "ws";
import Game from "./game.js";
import { v4 as uuidv4 } from "uuid";

const port = 8080;
const games = {};

let wss = new WebSocketServer({ port });
console.log(`server started on port ${port}`);

const router = {
  join: () => {},
  newGame: () => {},
};

wss.on("connection", function connection(connection) {
  console.log("Client connected");
  let ID = null;
  let clientState = {};
  connection.on("message", function incoming(message) {
    clientState = JSON.parse(message);
    console.log("Received: ", clientState);

    switch (clientState.action) {
      case "join": {
        ID = clientState.ID;
        if (ID in games) {
          try {
            games[ID].addPlayer(clientState.playerName);
          } catch (e) {
            console.log(e);
          }
        }
        break;
      }
      case "newGame": {
        const host = clientState.playerName;
        const newID = uuidv4();
        ID = newID;
        games[newID] = new Game(newID, host);
        break;
      }
    }

    console.log(ID);
    console.log(games);
  });

  connection.on("close", function close() {
    console.log("disconnected");
  });

  connection.on("close", function close() {
    console.log(`${clientState.playerName} disconnected`);
    if (ID) {
      games[ID].deletePlayer(clientState.playerName);
      console.log(games);
    }
  });

  // ws.send("Hello, client! Welcome to the WebSocket server!");
  // setInterval(() => {
  //   ws.send("spam");
  // }, 2000);
});
