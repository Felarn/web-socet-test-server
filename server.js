import { WebSocketServer } from "ws";
import Game from "./game.js";
import { v4 as uuidv4 } from "uuid";
import Router from "./router.js";

const port = 8080;
const games = { maxID: 0 };
// let maxID = 0;
let wss = new WebSocketServer({ port });
console.log(`server started on port ${port}`);

const router = {
  join: () => {},
  newGame: () => {},
};

wss.on("connection", function connection(connection) {
  console.log("Client connected");
  const router = new Router(connection, games);
  connection.on("message", function incoming(message) {
    router.actOn(message);
  });

  connection.on("error", function close() {
    console.log("disconnected with error");
    router.leave();
  });

  connection.on("close", function close() {
    router.leave();
    console.log(games);
  });

  // setInterval(() => {
  //   ws.send("spam");
  // }, 2000);
});
