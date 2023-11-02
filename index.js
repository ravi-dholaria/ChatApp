import express from "express";
import cors from "cors";
import http from "http";
import chatRoute from "./Route/chatRoute.js";
import { Server } from "socket.io";
import { addUser, removeUser, getUser, getUsersInRoom } from "./User/users.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const io = new Server(server, {
  cors: {
    origin: "https://main--frabjous-travesseiro-a27752.netlify.app",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use("/chat", chatRoute);

io.on("connection", (socket) => {
  console.log(`User Connected`);
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      callback(error);
    } else {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room ${user.room}!`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });
    socket.join(user.room);
    console.log(name, room);
    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: user.name, text: message });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      removeUser(socket.id);
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
