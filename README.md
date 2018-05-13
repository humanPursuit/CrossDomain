# CrossDomain
nodejs expressjs + jasmine test cross domain request  
[imooc ajax跨域完全讲解](https://www.imooc.com/learn/947) 

## 简单总结:
### 跨域产生的原因
1. 浏览器限制（同源策略）
2. 请求类型 xmlHttpRequest
3. 请求url 不同域

### 简单请求
- method: GET HEAD POST
- Content-Type: text/plain multipart/form-data application/x-www-form-urlencoded
- requestHeader 没有自定义请求头

### 非简单请求
- method: PUT DELETE等
- Content-Type: application/json
- 带自定义请求头

### 被调用端解决方法
1. jsonp 
缺点是只能处理`GET`请求，其他的一概没用
```
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
```
2. cors 
```
  // 简单请求
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  
  // 非简单请求 需要preflight request 如POST
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 缓存preflight request  
  res.setHeader("Access-Control-Max-Age", 3600);
```

3. cookie

- 需要添加 `xhrFields: { withCredentials: true }`,
- `Access-Control-Allow-Origin` 在使用cookie跨域的时候不能使用通配符，必须和*调用方*的域相同

```
  // client
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

  // server
  var origin = req.get('origin');  
  res.setHeader("Access-Control-Allow-Origin", origin);

```

4. 自定义请求头

```
  // client
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
  
  // server
  var headers = req.headers["access-control-request-headers"];
  res.setHeader("Access-Control-Allow-Headers", headers);

```

### 调用端解决方法
- HttpServer代理 转发跨域的xhr请求，让浏览器看起来是同域的请求 Appache、Ngix



