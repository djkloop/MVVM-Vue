import SubQueue from './suber';
// Enable LiveReload
document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></script>');
interface GoodVueOptsInterFace {
  el : string,
  beforeCreated: Function,
  created: Function,
  data: object,
  methods?: {},
  mounted: Function
}


class GoodVue {
  el: string;
  created: Function;
  data: Object;
  methods: Object;
  subQueue: any;
  constructor(opts : GoodVueOptsInterFace) {
    if(!opts) console.warn('确定传参数了吗?')
    if (opts && !opts.el) console.warn('请填写参数: el')
    // 第一个钩子函数
    opts.beforeCreated && opts.beforeCreated.call(this)
    this.el = opts.el
    console.log(this.el);
    // 第二个钩子函数
    this.created = opts.created && opts.created.bind(this)
    // data
    this.data = opts.data || {} // 数据
    this.methods = opts.methods // 实例方法
    this.subQueue = new SubQueue() //订阅器队列
    this.init();
    opts.mounted && opts.mounted.call(this)
  }

  init () {
    Object.keys(this.data).forEach( key => {
      console.log(key,' init')
        this.proxyKeys(key);
    })
    // new Observer(this.data, this) // 数据绑定
    this.created && this.created() // created 钩子
    // new Compile(this) // 节点解析
  }

  // 代理属性
  proxyKeys (attr) {
    Object.defineProperty(this, attr, {
        enumerable: true,
        configurable: true,
        get () {
            console.log(this.data[attr], ' Get')
            return this.data[attr]
        },
        set (newVal) {
            console.log(this.data[attr], newVal)
            if (this.data[attr] === newVal) return
            this.data[attr] = newVal
        }
    })
  }
}

export default GoodVue;