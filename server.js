import { WebSocketServer } from "ws";
import Router from "./router.js";

const port = 4444;
const games = { maxID: 0 };

let wss = new WebSocketServer({ port });
console.log(`server started on port ${port}`);

wss.on("connection", function connection(connection) {
  console.log("Client connected");
  const router = new Router(connection, games);
  connection.on("message", function incoming(message) {
    router.actOn(message);
  });

  connection.on("error", function close() {
    router.leave();
    console.log("disconnected with error");
  });

  connection.on("close", function close() {
    router.leave();
    console.log(games);
  });
});
