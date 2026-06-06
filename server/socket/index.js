import { Server } from "socket.io";

import registerBuilderEvents
from "./builderEvents.js";

import {registerPresence}
from "./presence.js";

let io;

export const initializeSocket =
(server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: [
        "GET",
        "POST"
      ]
    }
  });

  io.on(
    "connection",
    (socket) => {

      console.log(
        "Socket Connected:",
        socket.id
      );

      registerBuilderEvents(
        io,
        socket
      );

      registerPresence(
        io,
        socket
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            "Socket Disconnected:",
            socket.id
          );
        }
      );
    }
  );

  return io;
};

export const getIO =
() => io;