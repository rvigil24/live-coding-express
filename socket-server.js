const socketIO = require("socket.io");
const ot = require("./lib/ot/index");
const Task = require("./models/Task");

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
              Task.findByIdAndUpdate(
                data.room,
                {
                  content: socketIOServer.document,
                },
                (err) => {
                  if (err) return cb(false);
                  return cb(true);
                }
              );
            }
          );
          roomList[data.room] = socketIOServer;
        }
        roomList[data.room].addClient(socket);
        roomList[data.room].setName(socket, data.username);
      } catch (ex) {}

      socket.join(data.room);
      socket.room = data.room;
      //socket for chats
      socket.on("chatMessage", (data) => {
        io.to(socket.room).emit("chatMessage", data);
      });

      //disconnect socket
      socket.on("disconnect", (d) => {
        const clients = io.sockets.adapter.rooms.get(socket.room);
        const numClients = clients ? clients.size : 0;
        socket.leave(socket.room);
        if (numClients === 0) {
          delete roomList[data.room];
          delete socket.room;
          Task.findByIdAndDelete(data.room, (err, task) => {
            if (err) console.log(err);
            console.log("task deleted: ", task._id);
          });
        }
      });
    });
  });
};
