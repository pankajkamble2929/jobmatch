// utils/socket.js
let io = null;
const connectedUsers = {};

function initSocket(server) {
  const socketio = require("socket.io");
  io = socketio(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", socket => {
    console.log("Socket connected:", socket.id);

    socket.on("registerUser", userId => {
      if (userId) connectedUsers[userId] = socket.id;
    });

    socket.on("disconnect", () => {
      for (const id in connectedUsers) {
        if (connectedUsers[id] === socket.id) {
          delete connectedUsers[id];
          break;
        }
      }
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIo, connectedUsers };
