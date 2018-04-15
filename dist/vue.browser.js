/*
  mvvm-vue.js v1.0.0
  Created Date 2018-04-15 14:22:14
  Last Modified 2018-04-15 15:57:40
  当前DEMO - 纯粹是为了学习VueJS.
  Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.GoodVue = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /*
      订阅者: 收到属性的变化通知并执行相应的函数，从而更新视图
          @params: vm     : 对象实例
          @params: attr   : 该实例下的属性
          @params: cb     : 发生变化时触发的回调函数
  */
  var Suber = function () {
    function Suber(vm, attr, cb) {
      classCallCheck(this, Suber);

      this.vm = vm;
      this.attr = attr;
      this.cb = cb;
      this.value = this.get();
    }

    createClass(Suber, [{
      key: 'get',
      value: function get$$1() {
        this.vm.subQueue.target = this; // 添加当前订阅者
        var value = this.getAttrVal(this.attr); // 通过获取该属性值来把当前订阅者放入队列
        this.vm.subQueue.target = null; // 清除缓存
        return value;
      }
    }, {
      key: 'update',
      value: function update() {
        var value = this.getAttrVal(this.attr);
        if (value !== this.value) {
          this.cb && this.cb(value);
          this.value = value;
        }
      }
      // 属性值

    }, {
      key: 'getAttrVal',
      value: function getAttrVal(attr) {
        var _this = this;

        var vm = this.vm;
        if (attr.indexOf('.') >= 0) {
          var arr = attr.split('.');
          return arr.reduce(function (obj, attr) {
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
              return _this.vm[obj][attr];
            }
            return obj[attr];
          });
        } else {
          return this.vm[this.attr];
        }
      }
    }]);
    return Suber;
  }();
  /*
    订阅器队列: 我们需要一个队列来统一管理订阅者
  */

  var SubQueue = function () {
    function SubQueue() {
      classCallCheck(this, SubQueue);

      this.subs = [];
      this.target = null;
      console.log(this.subs, '  aaaa');
    }

    createClass(SubQueue, [{
      key: 'addSub',
      value: function addSub(sub) {
        //添加订阅者
        this.subs.push(sub);
      }
    }, {
      key: 'notifyAllSubs',
      value: function notifyAllSubs() {
        // 通知所有订阅者
        this.subs.forEach(function (sub) {
          sub.update();
        });
      }
    }]);
    return SubQueue;
  }();

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
  var Observer = function () {
    function Observer(data, vm) {
      classCallCheck(this, Observer);

      this.data = data;
      this.vm = vm;
      this.init();
    }

    createClass(Observer, [{
      key: 'init',
      value: function init() {
        this.initData(this.data);
      }
    }, {
      key: 'initData',
      value: function initData(data) {
        var _this2 = this;

        if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return;
        Object.keys(data).forEach(function (key) {
          _this2.defineProperty(data, key, data[key]);
        });
      }
    }, {
      key: 'defineProperty',
      value: function defineProperty$$1(data, attr, val) {
        this.initData(val);
        var _this = this;
        Object.defineProperty(data, attr, {
          enumerable: true,
          configurable: true,
          get: function get$$1() {
            if (_this.vm.subQueue.target) {
              // 初始化时,把订阅者添加进队列
              if (_this.vm.subQueue.subs.some(function (sub) {
                return sub === _this.vm.subQueue.target;
              })) return val;
              _this.vm.subQueue.addSub(_this.vm.subQueue.target);
            }
            return val;
          },
          set: function set$$1(newVal) {
            if (val === newVal) return;
            console.log(attr + '\u539F\u6765\u7684\u503C:' + val + ',\u6700\u65B0\u7684\u503C:' + newVal);
            val = newVal;
            _this.vm.subQueue.notifyAllSubs();
          }
        });
      }
    }]);
    return Observer;
  }();

  /*
      compile: 解析器
  */

  var Compile = function () {
    function Compile(vm) {
      classCallCheck(this, Compile);

      this.vm = vm;
      this.el = document.querySelector(vm.el);
      this.fragment = null; //代码块
      this.init();
    }
    // 节点初始化


    createClass(Compile, [{
      key: 'init',
      value: function init() {
        this.fragment = this.getFragment();
        this.formatFragment(this.fragment);
        this.el.appendChild(this.fragment);
      }
      // 把指定el 里面的所有节点移入 代码块中

    }, {
      key: 'getFragment',
      value: function getFragment() {
        var fragment = document.createDocumentFragment();
        // 通过appendChild 把元素全部移入 fragment中
        var child = this.el.firstChild;
        while (child) {
          fragment.appendChild(child);
          child = this.el.firstChild;
        }
        return fragment;
      }
      // 格式化文档片段

    }, {
      key: 'formatFragment',
      value: function formatFragment(el) {
        var _this = this;

        [].slice.call(el.childNodes).forEach(function (node) {
          // 匹配双花括号
          var reg = /((?:\{\{)[^\{\}]*(?:\}\}))/g,
              text = node.textContent;
          if (node.nodeType === 3 && text.match(reg) && text.match(reg).length) {
            console.log(text.match(reg));
            console.log(node);
            // 该节点时文本节点 且 具有 {{}} 指令
            _this.formatText(node, text.match(reg));
          } else if (node.nodeType === 1 && node.attributes.length > 0) {
            // 该节点为元素节点时
            _this.getDirective(node);
          }
          if (node.childNodes && node.childNodes.length) {
            _this.formatFragment(node);
          }
        });
      }
      // 格式化文本节点的内容

    }, {
      key: 'formatText',
      value: function formatText(node, attrs) {
        var _this2 = this;

        var initText = node.textContent; // 获取文本
        console.log(initText);
        attrs.forEach(function (attr) {
          // 这个地方拿到了双花括号里面的变量
          var val = _this2.getAttrVal(attr.slice(2, -2));
          console.log(attr, val, _this2.vm);
          // 这时候值被替换了
          node.textContent = node.textContent.replace(attr, val); // 初始化属性值
          console.log(node.textContent, ' 值是否被替换了么');
          var text = initText;
          new Suber(_this2.vm, attr.slice(2, -2), function (val) {
            console.log(val);
            node.textContent = attrs.forEach(function (key) {
              // 获取到值后 重新遍历该文本节点中的 {{}} 指令
              var keyVal = _this2.getAttrVal(key.slice(2, -2));
              text = text.replace(key, keyVal);
            });
            node.textContent = text;
            text = initText; // 设置完毕, 重新初始化值便于下次修改赋值
          });
        });
      }
      // 属性值

    }, {
      key: 'getAttrVal',
      value: function getAttrVal(attr) {
        var _this3 = this;

        if (attr.indexOf('.') >= 0) {
          var attrArr = attr.split('.');
          return attrArr.reduce(function (obj, attr) {
            // 这个地方不知道为什么要判断一下?
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
              return _this3.vm[obj][attr];
            }
            return obj[attr];
          });
        } else {
          return this.vm[attr];
        }
      }
      // 执行指令

    }, {
      key: 'getDirective',
      value: function getDirective(node) {
        var _this4 = this;

        var attrs = node.attributes;
        [].slice.call(attrs).forEach(function (attr) {
          if (attr.name.indexOf('v-') >= 0) {
            var val = attr.value;
            if (attr.name.indexOf('v-on:') >= 0) {
              // v-on: 事件指令
              _this4.compileEvent(node, attr);
            } else if (attr.name.indexOf('v-model') >= 0) {
              //v-model指令
              _this4.compileModel(node, val);
            } else if (attr.name.indexOf('v-bind') >= 0) {
              //v-bind指令
              _this4.compileBind(node, attr);
            } else {
              // 其余指令
              console.log('其余指令');
            }
          } else if (attr.name.indexOf(':') === 0) {
            // v-bind: 指令简写
            _this4.compileBind(node, attr);
          } else if (attr.name.indexOf('@') === 0) {
            // v-on: 指令简写
            _this4.compileEvent(node, attr);
          }
        });
      }
      // v-model指令

    }, {
      key: 'compileModel',
      value: function compileModel(input, attr) {
        var _this5 = this;

        var reg = /((?:\{\{)[^\{\}]*(?:\}\}))/g,
            getNodeText = function getNodeText(el) {
          [].slice.call(el.childNodes).forEach(function (node) {
            var text = node.textContent;
            if (node.nodeType === 3 && node.textContent.indexOf('{{' + attr + '}}') >= 0) {
              _this5.formatText(node, text.match(reg));
            }
            if (node.childNodes && node.childNodes.length > 0) {
              getNodeText.call(_this5, node);
            }
          });
        };
        getNodeText.call(this, this.fragment);
        input.value = this.getAttrVal(attr);
        input.addEventListener('input', function (e) {
          if (attr.indexOf('.') < 0) return _this5.vm[attr] = e.target.value;
          attr.split('.').reduce(function (obj, attr, index, arr) {
            if (index >= arr.length - 1) {
              if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
                return _this5.vm[obj][attr] = e.target.value;
              }
              return obj[attr] = e.target.value;
            }
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
              return _this5.vm[obj][attr];
            }
            return obj[attr];
          });
        });
      }
      // v-on指令

    }, {
      key: 'compileEvent',
      value: function compileEvent(node, attr) {
        var ev = attr.name.indexOf(':') >= 0 && attr.name.split(':')[1] || attr.name.indexOf('@') >= 0 && attr.name.split('@')[1],
            fn = attr.value;
        if (typeof this.vm.methods[fn] !== 'function') return console.warn('methods 里面只能放函数');
        node.addEventListener(ev, this.vm.methods[fn].bind(this.vm));
      }
      // v-bind指令

    }, {
      key: 'compileBind',
      value: function compileBind(node, attr) {
        var _this6 = this;

        var name = attr.name.split(':')[1],
            value = attr.value;
        new Suber(this.vm, value, function (val) {
          console.log(val);
          node[name] = _this6.getAttrValue(value);
        });
        node[name] = this.getAttrValue(value);
      }
      // 获取属性值

    }, {
      key: 'getAttrValue',
      value: function getAttrValue(attr) {
        var _this7 = this;

        if (attr.indexOf('.') < 0) return this.vm[attr];
        return attr.split('.').reduce(function (obj, attr, index, arr) {
          if (index >= arr.length - 1) {
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
              return _this7.vm[obj][attr];
            }
            return obj[attr];
          }
          if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
            return _this7.vm[obj][attr];
          }
          return obj[attr];
        });
      }
    }]);
    return Compile;
  }();

  /*
      实例
  */
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></script>');

  var GoodVue = function () {
    function GoodVue(opts) {
      classCallCheck(this, GoodVue);

      if (!opts) return console.warn('传参数了么?');
      if (!opts.el) return console.warn('请填写参数: el');
      opts.beforeCreate && opts.beforeCreate.call(this); // beforeCreate 钩子
      this.el = opts.el;
      this.created = opts.created && opts.created.bind(this); // created 钩子
      this.data = opts.data || {}; // 数据
      this.methods = opts.methods; // 实例方法
      this.subQueue = new SubQueue(); //订阅器队列
      this.init();
      opts.mounted && opts.mounted.call(this); // mounted 钩子
    }

    createClass(GoodVue, [{
      key: 'init',
      value: function init() {
        var _this = this;

        Object.keys(this.data).forEach(function (key) {
          _this.proxyKeys(key);
        });
        // new Observer(this.data, this) // 数据绑定
        this.created && this.created(); // created 钩子
        new Compile(this); // 节点解析
      }
      // 代理属性

    }, {
      key: 'proxyKeys',
      value: function proxyKeys(attr) {
        Object.defineProperty(this, attr, {
          enumerable: true,
          configurable: true,
          get: function get$$1() {
            return this.data[attr];
          },
          set: function set$$1(newVal) {
            if (this.data[attr] === newVal) return;
            this.data[attr] = newVal;
          }
        });
      }
    }]);
    return GoodVue;
  }();

  return GoodVue;

})));
