import { Server }
from "socket.io";

import jwt from "jsonwebtoken";

import registerBuilderEvents
from "./builderEvents.js";

import {
 registerPresence
}
from "./presence.js";

import registerCollaboration
from "./collaboration.js";

import registerComments
from "./comments.js";

let io;

// Same origins as the Express app - no wildcard in production paths
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:3001",
].filter(Boolean);

export const initializeSocket =
(server)=>{

 io = new Server(
  server,
  {
   cors:{
    origin: allowedOrigins,
    methods:[
     "GET",
     "POST"
    ],
    credentials:true,
   }
  }
 );

 // Handshake auth - require a valid user OR admin JWT before any events flow
 io.use((socket, next) => {
   try {
     const token = socket.handshake.auth?.token;
     if (!token) {
       return next(new Error("Authentication required"));
     }
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     socket.data.userId = decoded.userId || undefined;
     socket.data.adminId = decoded.adminId || undefined;
     if (!socket.data.userId && !socket.data.adminId) {
       return next(new Error("Authentication required"));
     }
     next();
   } catch {
     next(new Error("Invalid token"));
   }
 });

 io.on(
  "connection",
  (socket)=>{

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

   registerCollaboration(
    io,
    socket
   );

   registerComments(
    io,
    socket
   );

   socket.on(
    "disconnect",
    ()=>{

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
()=>io;
