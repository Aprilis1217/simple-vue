import Observer from "./observer/index.js";
import Compile from "./compile/index.js";

const noop = () => { };

/**
 * SimpleVue构造函数
 * @param {Object} options 选项配置对象
 * @param {String|Element} options.el 根元素
 * @param {Object} options.data 数据
 */
class SimpleVue {
  constructor(options) {
    // 获取传入的选项配置对象，默认为空对象
    this.$options = options || {};
    // 获取根元素 el
    this.$el = typeof options.el === 'string' ? document.getElementById('app') : options.el;
    // 获取数据 data ，默认为空对象
    this.$data = options.data || {};
    // 初始化生命周期
    this.initLifeCycle(options);
    // data 中的数据代理到 SimpleVue 实例上
    this._proxyData(this.$data);
    if (this.$el) {
      // 数据劫持
      new Observer(this.$data);
      // 编译模板
      new Compile(this);
      // 执行 mounted 钩子函数
      this.$mounted();
    }
  }
  initLifeCycle(options) {
    // 初始化生命周期
    console.log(options, 'initLifeCycle')
    this.$mounted = options.mounted || noop;
  }
  // & 数据代理 对 this.$data 代理，让 this[xxx] 指向 this.$data[xxx]
  _proxyData(data) {
    console.log(data, '_proxyData')
    // 遍历 data 中的所有属性，进行数据劫持
    Object.keys(data).forEach(key => {
      console.log(key, 'key===========')
      // 把 data 中的属性，转换成 getter 和 setter
      Object.defineProperty(this, key, {
        // true 可枚举（可遍历）false 不可枚举
        configurable: true,
        // true 可以被修改 false 不可以被修改
        enumerable: true,
        get() {
          return data[key];
        },
        set(newVal) {
          if (newVal === data[key]) return;
          data[key] = newVal;
        }
      });
    })
  }
}

export default SimpleVue;
