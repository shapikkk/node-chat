let app = require('express')();
let http = require('http').Server(app);

let socketIO = require('socket.io'),
    http = require('http'),
    port = process.env.PORT || 4000,
    ip = process.env.IP,
    server = http.createServer().listen(port, ip, function() {
        console.log("IP = " , ip);
        console.log("port = " , port);
        console.log("start socket successfully");
});

let usersList=[];
let groupList = [];

io = socketIO.listen(server);
