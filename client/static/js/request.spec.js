// 用例归组
describe("A suite", function() {
  // 定义单条用例
  it("contains spec with an exception", function() {
    // 断言 assertion
    expect(true).toEqual(true);
  });
});

describe("The 'toBe' matcher compares with ===", function() {
  it("and has a positive case", function() {
    expect(true).toBe(true);
  });

  it("and has a negative case", function() {
    expect(false).not.toBe(true);
  });
});

describe("A suite with some shared setup", function() {
  var foo = 1;
  // avoid duplicated setup and teardown
  // beforeEach, afterEach, beforeAll, afterAll\
  // 钩子函数和用例摆放次序和执行无关
  // beforeEach, it,  afterEach 共享一个this对象 可以用来存储共享的变量

  beforeEach(function() {
    // 每个用例执行前 foo加1
    foo++;
  });

  afterEach(function() {
    // 每个用例执行完后 重置
    foo = 0;
  });

  beforeAll(function() {
    // 所有用例执行前 foo加1
    foo++;
  });

  afterAll(function() {
    // 所有用例执行完后 重置
    foo = 0;
  });

  it("aaa", function() {
    expect(1).toEqual(1);
  });

  it("bbb", function() {
    expect(1).toEqual(1);
  });
});

describe("A spec using the fail function", function() {
  var foo = function(x, callback) {
    if (x) {
      callback();
    }
  };

  it("should not call the callback", function() {
    foo(false, function() {
      fail("Callback has been called");
    });
  });
});

// pending状态的specs
xdescribe("Pending specs", function() {
  // 1. 通过xit方法声明
  xit('can be declared "xit"', function() {
    expect(true).toBe(false);
  });
  // 2. spec不定义断言函数
  it("can be declared with 'it' but without a function");

  // 3. 显式调用pending方法
  it("can be declared by calling 'pending' in the spec body", function() {
    expect(true).toBe(false);
    pending("this is why it is pending");
  });
});

/* spies: track function excuting and arguments */
describe("A spy", function() {
  var foo = (bar = null);

  beforeEach(function() {
    foo = {
      setBar: function(value) {
        bar = value;
      }
    };

    spyOn(foo, "setBar");

    foo.setBar(123);
    foo.setBar(456, "another param");
  });

  it("tracks that the spy was called", function() {
    expect(foo.setBar).toHaveBeenCalled();
  });

  it("tracks that the spy was called x times", function() {
    expect(foo.setBar).toHaveBeenCalledTimes(2);
  });
  // 检查参数
  it("tracks all the arguments of its calls", function() {
    expect(foo.setBar).toHaveBeenCalledWith(123);
    expect(foo.setBar).toHaveBeenCalledWith(456, "another param");
  });

  it("stops all execution on a function", function() {
    expect(bar).toBeNull();
  });

  it("tracks if it was called at all", function() {
    foo.setBar();

    // console.log(foo.setBar.calls.any());

    expect(foo.setBar.calls.any()).toEqual(true);
  });
});
