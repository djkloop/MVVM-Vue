class Suber {
  vm?: {
    subQueue?: {
      target?: Object | {}
    }
  };
  attr: any;
  cb:Function;
  value: any;
  constructor(vm, attr, cb) {
    this.vm = vm;
    this.attr = attr;
    this.cb = cb;
    this.value = this.get();
  }

  get() {
    this.vm.subQueue.target = this // 添加当前订阅者
    let value = this.getAttrVal(this.attr) // 通过获取该属性值来把当前订阅者放入队列
    this.vm.subQueue.target = null // 清除缓存
    return value

  }

  update () {
    let value = this.getAttrVal(this.attr)
    if (value !== this.value) {
        this.cb && this.cb(value)
        this.value = value
    }
  }

  getAttrVal (attr) {
    let vm = this.vm
    if (attr.indexOf('.') >= 0) {
      let arr = attr.split('.')
      return arr.reduce( (obj, attr) => {
        if (typeof obj !== 'object') {
            return this.vm[obj][attr]
        }
        return obj[attr]
      })
    }else{
      return this.vm[this.attr]
    }
  }
}


export default class SubQueue {
  subs: Array<any>;
  target: void;
  constructor() {
    this.subs = [];
    this.target = void 0;
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notifyAllSubs() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}