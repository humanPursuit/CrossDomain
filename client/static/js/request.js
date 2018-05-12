// 跨域问题产生的原因
// 1. 浏览器同源策略的限制
// 2. 请求url地址或者port非同源
// 3. xmlHttpRequest 其他不受影响 eg. <img src="http://localhost:30001/jsonp" />

describe("cross origin request", function() {
  var remoteBase = "http://localhost:30001";

  it(
    "jsonp request",
    function(done) {
      // JSONP
      // 只能处理GET请求，需要被调用端的代码修改
      $.ajax({
        url: remoteBase + "/jsonp",
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
});
