import express from "express";

import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
io.on("connection", (socket) => {
  console.log("User is connected using ID:", socket.id);

  socket.on("join_room", (data) => {
    const { roomId, email } = data;
    console.log("User Submitted the data", data);
    emailToSocketMapping.set(email, socket.id);
    socketToEmailMapping.set(socket.id, email);
    socket.join(roomId);
    socket.emit("joined_room", roomId);
    socket.broadcast.to(roomId).emit("user_joined", email);
  });
  socket.on("call-user", ({ email, offer }) => {
    const socketId = emailToSocketMapping.get(email);
    const from = socketToEmailMapping.get(socket.id);
    console.log({ from, socketId });
    socket.to(socketId).emit("incoming-call", {
      from,
      offer,
    });
  });
  socket.on("call-accept", (data) => {
    const { email, answer } = data;
    const socketId = emailToSocketMapping.get(email);
    socket.to(socketId).emit("call-accepted", { answer });
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("User with socket id disconnected:", socket.id);
    const email = socketToEmailMapping.get(socket.id);
    emailToSocketMapping.delete(email);
    socketToEmailMapping.delete(socket.id);
  });
});
server.listen(8080, () => {
  console.log("Express Serevre is runnint at : 8080");
});
