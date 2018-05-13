// 跨域问题产生的原因
// 1. 浏览器同源策略的限制
// 2. 请求url地址或者port非同源
// 3. xmlHttpRequest 其他不受影响 eg. <img src="http://localhost:30001/jsonp" />

describe("cross origin request", function() {
  var remoteBase = "http://localhost:30001";

  /**
   * JSONP 跨域
   */
  // 只能处理GET请求，需要被调用端的代码修改
  it(
    "jsonp request",
    function(done) {
      $.ajax({
        url: remoteBase + "/jsonp",
        // method: 'POST', // 无效 JSONP 不支持
        dataType: "jsonp", // 从服务器返回你期望的数据类型
        // jsonp: "wakakakaka", // 与后端约定的qs取函数的键
        // jsonpCallback: "fooo", // 与后端约定的函数名字
        // cache: false, // 默认false 在url后面会加时间戳
        // 生成请求 "/jsonp?wakakakaka=fooo"
        // jquery 生成一个全局函数 指向success这个方法
        success: function(data) {
          expect(data).toEqual({ name: "fooBar" });
          done();
        }
      });
    },
    2000
  );

  /**
   * CORS 跨域
   */
  // 简单请求
  // method: GET HEAD POST
  // Content-Type: text/plain multipart/form-data application/x-www-form-urlencoded
  // requestHeader 没有自定义请求头

  // Failed to load http://localhost:30001/cors: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:30000' is therefore not allowed access.
  // 直接调用下面的代码会报如上错误，在http-response-header中没有指定Access-Control-Allow-Origin 需在被调用端处理
  it(
    "cors GET request",
    function(done) {
      $.ajax({
        url: remoteBase + "/cors",
        success: function(data) {
          expect(data).toEqual({ name: "fooBar" });
          done();
        }
      });
    },
    2000
  );

  it(
    "cors POST request",
    function(done) {
      // 这里的content-type
      // Content-Type: application/x-www-form-urlencoded; charset=UTF-8
      $.ajax({
        url: remoteBase + "/cors",
        method: "POST",
        data: { name: 123 },
        success: function(data) {
          expect(data).toEqual({ name: "fooBar" });
          done();
        }
      });
    },
    2000
  );

  // 非简单请求
  // method: put delete
  // Content-Type: application/json
  // 带自定义请求头

  // 非简单请求 需要预检请求（preflight request）

  it(
    "POST json request",
    function(done) {
      var postData = JSON.stringify({ name: 123 });
      // 这里的content-type
      // Content-Type: application/x-www-form-urlencoded; charset=UTF-8
      $.ajax({
        url: remoteBase + "/postJson",
        method: "POST",
        data: postData,
        dataType: "JSON",
        contentType: "application/json;chartset=UTF-8",
        success: function(data) {
          expect(data).toEqual(postData);
          done();
        }
      });
    },
    2000
  );

  /**
   * Cookie 跨域
   */
  // 这里的cookie 是被调用的域名下的cookie
  // 例如 页面origin是 a.com，接口origin是 b.com, cookie是加载b.com下的
  it(
    "with cookie",
    function(done) {
      $.ajax({
        url: remoteBase + "/withCookie",
        method: "POST",
        dataType: "JSON",
        // 使用cookie跨域
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          expect(data).toEqual({ name: "foo" });
          done();
        }
      });
    },
    2000
  );

  /**
   * 自定义请求头跨域 跨域
   */
  it(
    "custom header",
    function(done) {
      // RequestHeader中会添加 Access-Control-Request-Headers: x-header1,x-header2
      $.ajax({
        url: remoteBase + "/customHeader",
        method: "POST",
        dataType: "JSON",
        // 使用cookie跨域
        headers: {
          "x-header1": "AAA"
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("x-header2", "BBB");
        },
        success: function(data) {
          expect(data).toEqual({ header: "AAA BBB" });
          done();
        }
      });
    },
    2000
  );
});
