var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);

var config = require("../config");
var port = config.server.port;

const data = { name: "fooBar" };

server.listen(port, function() {
  console.log("Server server listening at http://localhost:%s", port);
});

// static resource route
app.use(express.static(__dirname + "/static"));

app.get("/", function(req, res) {
  res.send("Server side is working");
});

app.get("/jsonp", function(req, res) {
  var callbackName = req.query.callback;
  var resText = callbackName + "(" + JSON.stringify(data) + ")";
  res.send(resText);
});
