/*
    监听器: //用来劫持并监听所有属性，如果有变动的，就通知订阅者
        @params: data  :监听data里面的所有属性,  利用Object.defineProperty监听属性变化, 来告诉Watcher来更新该属性

*/
// export default class Observer {
//   constructor(data, vm) {
//     this.data = data
//     this.vm = vm
//     this.init()
//   }
//   init() {
//     this.initData(this.data)
//   }
//   initData(data) { // 初始化数据
//     console.log(data, ' observer obersver');
//     if(!data || typeof data !== 'object') return
//     Object.keys(data).forEach(key => {
//       this.defineProperty(data, key, data[key])
//     })
//   }
//   defineProperty(parent, attr, val) { //通过 Object.defineProperty 来劫持数据 做到监听效果
//     console.log(parent, attr, val, ' defineProperty');
//     this.initData(val) // 递归监听
//     let _this = this
//     Object.defineProperty(parent, attr, {
//       enumerable: true,
//       configurable: true,
//       get() {
//         if(_this.vm.subQueue.target) { // 初始化时,把订阅者添加进队列
//           if(_this.vm.subQueue.subs.some(sub => sub === _this.vm.subQueue.target)) return val
//           _this.vm.subQueue.addSub(_this.vm.subQueue.target)
//         }
//         return val
//       },
//       set(newVal) {
//         if(val === newVal) return
//         console.log(`${attr}原来的值:${val},最新的值:${newVal}`)
//         val = newVal
//         _this.vm.subQueue.notifyAllSubs()
//       }
//     })
//   }
// }
export default class Observer {
  constructor(data, vm) {
    this.data = data;
    this.vm = vm;
    this.init();
  }
  init() {
    this.initData(this.data);
  }
  initData(data) {
    if(!data || typeof data !== 'object') return;
    Object.keys(data).forEach(key => {
      this.defineProperty(data, key, data[key])
    })
  }
  defineProperty(data, attr, val) {
    this.initData(val);
    let _this = this;
    Object.defineProperty(data, attr, {
      enumerable: true,
      configurable: true,
      get() {
        if(_this.vm.subQueue.target) { // 初始化时,把订阅者添加进队列
          if(_this.vm.subQueue.subs.some(sub => sub === _this.vm.subQueue.target)) return val
          _this.vm.subQueue.addSub(_this.vm.subQueue.target)
        }
        return val
      },
      set(newVal) {
        if(val === newVal) return
        console.log(`${attr}原来的值:${val},最新的值:${newVal}`)
        val = newVal
        _this.vm.subQueue.notifyAllSubs()
      }
    })
  }
}