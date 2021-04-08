const socketIO = require("socket.io");

module.exports = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      socket.room = data.room;
      socket.join(data.room);
    });
    socket.on("chatMessage", (data) => {
      io.to(socket.room).emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
      socket.leave(socket.room);
    });
  });
};
