var WebSocketServer = require('ws').Server, webSocketServer = new WebSocketServer({ port: 7777 });
var HashMap = require('hashmap');
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Server started.")
// record the client
var users = new HashMap();
var userid = new HashMap();
// connection
webSocketServer.on('connection', function (ws) {
    function sendAll(msg, sender = "Server") {
        var date = new Date()
        userid.forEach(function (value, key) {
            value.send(JSON.stringify(
                {
                    "msg": msg,
                    "sender": sender,
                    "time": date.toLocaleDateString() + " " + date.toLocaleTimeString()
                }
            ));
        })
    }
    function send(msg, sender = "Server") {
        var date = new Date()
        ws.send(JSON.stringify(
            {
                "msg": msg,
                "sender": sender,
                "time": date.toLocaleDateString() + " " + date.toLocaleTimeString()
            }
        ));
    }
    ws.on('message', function (message) {
        //console.log(connectNum + ": " + message)
        var msg = JSON.parse(message);
        if (msg.msg == "/login") {
            if (users.get(msg.sender) == null&&users.get(msg.sender) != "Server") {
                userid.set(msg.id, ws)
                users.set(msg.sender, msg.id)
                sendAll(msg.sender + " 加入服务器")
                console.log('A client has connected. ID: ' + msg.id);
            }
            else {
                send("加入失败，已存在相同名称的用户")
            }

        } else if (msg.msg == "/list") { sendAll(users.keys().toString()) } else {
            sendAll(msg.msg, msg.sender);

        }
        console.log(new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + " <" + msg.sender + "> " + msg.msg);

    });

    ws.on('close', function (msg) {
        var disc = userid.search(ws)
        var disc2 = users.search(disc)
        userid.remove(disc)
        users.remove(disc2)
        if(disc!=null){
        console.log('A client has disconnected. ID: ' + disc);
        sendAll(disc2 + " 退出服务器")}
    });
   // rl.on("line", function (line) {
   //     send(line);
   // })
});
