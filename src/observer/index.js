import Dep from './dep.js';
/**
 * Observer 类
 * 负责把 data 中的属性转换成 getter 和 setter
 * 从而让 data 中的属性能够被侦测
 * @param {*} data data 中的数据
 * @param {*} vm Vue 实例
 * @param {*} key data 中的属性名
 * @param {*} value data 中的属性值
 */
class Observer {
  constructor(data) {
    console.log(data, 'Observer')
    this.data = data
    this.walk(data);
  }
  walk(data) {
    // 判断是不是数据
    if (Array.isArray(data)) {
      this.observeArray(data);
    } else {
      this.observer(data);
    }
  }
  // 数组的特殊处理
  observeArray(arr) {
    arr.forEach(val => {
      this.walk(val);
    })
  }
  observer(data) {
    // 判断 data 是否是对象
    if (!data || typeof data !== 'object') {
      console.log(data, 'data----------')
      return;
    }
    // 遍历 data 中的所有属性，进行数据劫持
    Object.keys(data).forEach(key => {
      console.log(key, 'key')
      // 把 data 中的属性，转换成 getter 和 setter
      this.defineReactive(data, key, data[key]);
      // 对 value 也进行响应式拦截
      console.log(data[key], 'data[key]')
      this.walk(data[key]);
    })
  }
  // & 定义响应式数据，将 data 中的属性转换成 getter 和 setter
  defineReactive(data, key, value) {
    let oldValue = value;
    // 创建一个 Dep 实例
    let dep = new Dep();
    // 保存当前的 this
    let that = this;
    // 给 data 的每一个属性，都添加一个 Dep 实例
    Object.defineProperty(data, key, {
      // true 可枚举（可遍历）false 不可枚举
      configurable: true,
      // true 可以被修改 false 不可以被修改
      enumerable: true,
      get() {
        // 判断 Dep.target 是否有值，如果有值，就添加到订阅者列表中
        console.log(oldValue, 'oldValue')
        dep.addSub(Dep.target);
        return oldValue;
      },
      set(newVal) {
        if (newVal === oldValue) return;
        // 对新值进行响应式拦截， 赋值后检查属性值是否是对象，是对象的话则将属性转化成响应式数据
        that.walk(newVal);
        oldValue = newVal;
        // 通知所有订阅者，数据变化后发送通知，触发 watcher 中的 update 方法更新数据
        dep.notify();
      }
    });
  }
}

export default Observer;