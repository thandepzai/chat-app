const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { createMessages } = require("./utils/create-message");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

// let count = 1;
// const messages = "Chao moi nguoi";

//lang nghe su kien connect
io.on("connection", (socket) => {
  console.log("a user connected");

  // //truyen count tu server ve clients
  // socket.emit("send count server to client", count);
  // socket.emit("send messages server to client", messages);

  // //nhan su kien tu client
  // socket.on("send increment client to server", () => {
  //   count+=1;
  //   // socket.emit("send count server to client", count);
  //   // tra ve cho all clients
  //   io.emit("send count server to client", count);
  // })
  //gui cho client vua ket noi
  socket.emit(
    "send message from server to client",
    createMessages("Chao mung ban den cyber chat", "Admin")

  );



  socket.on("join room from client to server", ({ room, username }) => {
    socket.join(room);

    //gui cho cac client con lai
    socket.broadcast.to(room).emit("send message from server to client", createMessages(`${username} moi vao phong chat ${room}`, username));

    //chat
    socket.on("send message from client to server", (messageText, callback) => {
      const filter = new Filter();
      if (filter.isProfane(messageText)) {
        return callback("messageText khong hop le vi co nhung tu khoa tuc tiu");
      }

      io.to(room).emit("send message from server to client", createMessages(messageText, username));
      callback();
    });

    //xu ly chia se vi tri
    socket.on("share location from client to server", ({latitude, longitude})=> {
      const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      io.to(room).emit("share location from server to client", createMessages(linkLocation, username));
      console.log("🚀 ~ file: server.js:53 ~ socket.on ~ linkLocation:", linkLocation)
    })

    const newUser =   {
      id: socket.id,
      username,
      room
    }
    addUser(newUser);

    //xu ly userlist
    io.to(room).emit("send user list from server to client", getUserList(room))

      // ngat ket noi
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit("send user list from server to client", getUserList(room))
      console.log("user disconnected");
    });
  }) 


});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`app run on http://localhost:${port}`);
});
