function Observer(data){
  this.data = data;
  this.handler(data);
}

Observer.prototype.handler = function(data){
  let val;
  for(let key in data){
    if(data.hasOwnProperty(key)){
      val = data[key];
      if(typeof val == 'object'){
        new Observer(val)
      }
    }
    this.watch(key, val);
  }
}

Observer.prototype.watch = function(key, val){
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      console.log('你访问了' + key);
    },
    set: function(newVal){
      console.log('你设置了'+key);
      console.log('新的' + key + ' = ' + newVal)
      if(newVal == val) return;
      val = newVal
    }
  })
}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science