function Observer(data) {
  this.data = data;
  this.handler(data);
  this.event = new EventBus();
}

Observer.prototype.handler = function (data) {
  let val;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      val = data[key];
      if (typeof val == 'object') {
        new Observer(val)
      }
    }
    this.watch(key, val);
  }
}

Observer.prototype.watch = function (key, val) {
  let that = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了' + key);
      return val
    },
    set: function (newVal) {
      if (typeof newVal == 'object') {
        new Observer(newVal);
        val = newVal;
        return
      } else {
        that.event.emit(key, newVal);
        console.log('你设置了' + key);
        console.log('新的' + key + ' = ' + newVal)
        console.log(this)
        if (newVal == val) return;
        val = newVal
      }
    }
  })
}

Observer.prototype.$watch = function (key, callback) {
  this.event.on(key, callback);
}

function EventBus() {
  this.events = {}
}

EventBus.prototype.on = function (key, callback) {
  if (!this.events[key]) {
    this.events[key] = [callback];
  } else {
    this.events[key].push(callback)
  }
}

EventBus.prototype.off = function (key) {
  for (let i in this.events) {
    if (this.events.hasOwnProperty(i) && i === key) {
      delete this.events[i]
    }
  }
}

EventBus.prototype.emit = function (key, ...arg) {
  this.events[key].forEach((callback) => {
    callback(...arg);
  })
}


let app1 = new Observer({
  name: 'youngwind',
  age: 25
});


app1.$watch('age', function (age) {
  console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'