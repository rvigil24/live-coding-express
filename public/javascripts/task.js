window.onload = function () {
  //************* variables
  var socket = io.connect("http://localhost:3000");
  var txtArea = document.getElementById("code-screen");
  var roomId = document.getElementById("roomId");
  var chatboxUsername = document.getElementById("chatbox-username");
  var chatboxMessageBox = document.getElementById("chatbox-userMessage");
  var chatboxListMessages = document.getElementById("chatbox-listMessages");
  var chatboxSendButton = document.getElementById("chatbox-sendButton");

  //************* functions
  var myCodeMirror = CodeMirror.fromTextArea(txtArea, {
    lineNumbers: true,
    theme: "monokai",
    extraKeys: { "Ctrl-Space": "autocomplete" },
    autocorrect: true,
  });
  txtArea.classList.remove("d-none");
  getUser();

  function getUser() {
    var user = chatboxUsername.innerHTML;
    if (user === "") {
      var userId = Math.floor(Math.random() * 9999).toString();
      user = "User" + userId;
      chatboxUsername.innerHTML = user;
    }
    return user;
  }

  function userMessage(name, text) {
    var msg = document.createTextNode(name + ": " + text);
    var p = document.createElement("p").appendChild(msg);
    var div = document.createElement("div");
    var li = document.createElement("li");
    li.classList.add("list-group-item");
    li.appendChild(div.appendChild(p));
    return li;
  }

  function sendMessage(e) {
    e.preventDefault();
    if (chatboxMessageBox.value) {
      socket.emit("chatMessage", {
        message: chatboxMessageBox.value,
        username: getUser(),
      });
    }

    chatboxMessageBox.value = "";
  }

  //************* events
  socket.on("chatMessage", function (data) {
    chatboxListMessages.append(userMessage(data.username, data.message));
  });

  socket.emit("joinRoom", roomId.value);

  chatboxSendButton.addEventListener("click", sendMessage);
};
