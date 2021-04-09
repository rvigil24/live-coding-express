window.onload = (function () {
  //************* variables
  var EditorClient = ot.EditorClient;
  var SocketIOAdapter = ot.SocketIOAdapter;
  var CodeMirrorAdapter = ot.CodeMirrorAdapter;
  var cmClient;

  var socket = io.connect("https://rt-coding.herokuapp.com");
  var editorTxtArea = document.getElementById("code-screen");
  var roomId = document.getElementById("roomId");
  var chatboxUsername = document.getElementById("chatbox-username");
  var chatboxMessageBox = document.getElementById("chatbox-userMessage");
  var chatboxListMessages = document.getElementById("chatbox-listMessages");
  var chatboxSendButton = document.getElementById("chatbox-sendButton");

  //************* functions
  var codeMirrorEditor = CodeMirror.fromTextArea(editorTxtArea, {
    lineNumbers: true,
    theme: "monokai",
    extraKeys: { "Ctrl-Space": "autocomplete" },
    autocorrect: true,
    mode: { name: "javascript", json: true },
  });
  editorTxtArea.classList.remove("d-none");

  getUser();

  function init(str, revision, clients, serverAdapter) {
    if (editorTxtArea.value === "") {
      codeMirrorEditor.setValue(str);
    }
    cmClient = window.cmClient = new EditorClient(
      revision,
      clients,
      serverAdapter,
      new CodeMirrorAdapter(codeMirrorEditor)
    );
  }

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
  chatboxSendButton.addEventListener("click", sendMessage);

  //sockets
  socket.emit("joinRoom", { room: roomId.value, username: getUser() });
  socket.on("chatMessage", function (data) {
    chatboxListMessages.append(userMessage(data.username, data.message));
  });
  socket.on("doc", function (obj) {
    init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
  });
})();
