const socketIO = require("socket.io");
const ot = require("./lib/ot/index");

const roomList = {};

module.exports = (server) => {
  var io = socketIO(server);

  io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      const str = "//insert your code here \n";
      //if room not registered
      try {
        if (!roomList[data.room]) {
          const socketIOServer = new ot.EditorSocketIOServer(
            str,
            [],
            data.room,
            (sck, cb) => {
              cb(true);
            }
          );
          roomList[data.room] = socketIOServer;
        }
        roomList[data.room].addClient(socket);
        roomList[data.room].setName(socket, data.username);
      } catch (ex) {
      }

      socket.join(data.room);
      socket.room = data.room;
      //socket for chats
      socket.on("chatMessage", (data) => {
        console.log("message to data room: ", socket.room);
        io.to(socket.room).emit("chatMessage", data);
      });

      //disconnect socket
      socket.on("disconnect", () => {
        socket.leave(socket.room);
      });
    });
  });
};
