var http = require("http");
var querystring = require("querystring");
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

app.use(function(req, res, next) {
  if (req.method === "POST") {
    var body = "";
    req.on("data", function(chunk) {
      body += chunk;
    });

    req.on("end", function() {
      req.body = body;
      next();
    });
  } else {
    next();
  }
});

app.get("/", function(req, res) {
  res.send("Server side is working");
});

app.all("/jsonp", function(req, res) {
  var callbackName = req.query.callback;
  var resText = callbackName + "(" + JSON.stringify(data) + ")";
  res.send(resText);
});

app.all("/cors", function(req, res) {
  // Access-Control-Allow-Origin, 表示允许跨域使用的域名
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:30000");
  // Access-Control-Allow-Origin, 表示允许使用的http请求类型
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.send(data);
});

app.all("/postJson", function(req, res) {
  // Acess-Control-Allow-Origin, Access-Control-Allow-Methods 可以使用通配符，也可以使用从req中读取的值
  var origin = req.get("origin");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", req.method);
  // 设置 OPTIONS 缓存时间
  res.setHeader("Access-Control-Max-Age", 3600);

  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "*");

  // Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.
  // xhr content-type 是json 非简单请求, 浏览器处理res报错
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 非简单请求 处理预检请求
  if (req.method == "OPTIONS") res.send(200);

  res.json(req.body);
});
