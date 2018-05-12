var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);

var config = require("../config");
var port = config.client.port;

// static resource route
app.use(express.static(__dirname + "/static"));

server.listen(port, function() {
  console.log("Client server listening at http://localhost:%s", port);
});
