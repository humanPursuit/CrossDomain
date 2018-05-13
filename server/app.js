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

// 处理jsonp
app.all("/jsonp", function(req, res) {
  var callbackName = req.query.callback;
  var resText = callbackName + "(" + JSON.stringify(data) + ")";
  res.send(resText);
});

// 处理cors
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
  if (req.method == "OPTIONS") return res.send();

  res.json(req.body);
});

// 处理cookie
app.all("/withCookie", function(req, res) {
  var cookies = req.get("cookie");
  var cookieData = Object.create(null);
  if (cookies) {
    cookies.split("&").forEach(function(cookie) {
      var arr = cookie.split("=");
      var key = arr[0];
      var value = arr[1];

      cookieData[key] = value;
    });
  }
  var origin = req.get("origin");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", req.method);
  // 使用cookie跨域
  res.setHeader("Access-Control-Allow-Credentials", true);

  //  The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. Origin 'http://localhost:30000' is therefore not allowed access. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
  // 使用cookie跨域时，Access-Control-Allow-Origin 不能使用通配符，必须和调用方同域;
  // 不合法
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "*");

  res.json({ name: cookieData.name || "foobar" });
});

// 处理自定义请求头
app.all("/customHeader", function(req, res) {
  var origin = req.get("origin");
  var headers = req.headers["access-control-request-headers"];
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", req.method);
  // Failed to load http://localhost:30001/customHeader: Request header field x-header2 is not allowed by Access-Control-Allow-Headers in preflight response.
  // 和content-type类似，一样要在Access-Control-Allow-Headers添加\
  if (headers) {
    res.setHeader("Access-Control-Allow-Headers", headers);
  }
  if (req.method == "OPTIONS") return res.send();

  res.json({ header: req.get("x-header1") + " " + req.get("x-header2") });
});
