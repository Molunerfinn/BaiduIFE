function Observer(data) {
  this.data = data;
  this.handler(data);
  this.event = new EventBus();
}

Observer.prototype.handler = function (data, path) {
  let val;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      val = data[key];

      !path ? path = key : path += key;

      if (typeof val == 'object') {
        new Observer(val)
        path ? path = path + '.' : '';
        this.handler(val,path)
      }
    }
    this.watch(data, key, val, path);
  }
}

Observer.prototype.watch = function (data, key, val, path) {
  let that = this;
  Object.defineProperty(data, key, {
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
        that.event.emit(path || key, newVal);
        console.log('你设置了' + key);
        console.log('新的' + key + ' = ' + newVal)
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

EventBus.prototype.emit = function (path, ...arg) {
  let keys = path.split('.');
  let paths = keys.map((key, index) => {
    if(index == 0){
      return key;
    }else{
      let str = '';
      while(index--){
        str = keys[index] + '.' + str;
      }
      return str + key;
    }
  })
  paths.forEach((path) => {
    let callbacks = this.events[path];
    if(callbacks && callbacks.length){
      callbacks.forEach((item) => {
        item()
      })
    }
  })
}

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。