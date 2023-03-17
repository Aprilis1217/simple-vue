import Dep from './../observer/dep.js'
/**
 * Watcher 类
 * 负责将模板中的变量替换成数据
 * 并且依赖收集
 * 当数据发生变化的时候，重新渲染视图
 * @param {*} vm Vue 实例
 * @param {*} expOrFn data 中的属性名
 * @param {*} cb 回调函数，负责更新视图
 */
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.cb = cb;
    // 将 watcher 对象记录到 Dep 类的静态属性 target
    this.get();
  }
  // 获取 data 中的属性值
  getVal(vm, exprs) {
    exprs.map(expr => {
      expr = expr.split('.');
      return expr.reduce((prev, next) => {
        console.log(prev, 'prev')
        if (!prev || typeof prev !== 'object') return undefined;
        return prev[next];
      }, vm.$data);
    })
  }
  // get 方法会触发属性的 getter，从而添加监听
  get() {
    // 将当前订阅者指向自己
    Dep.target = this; // ! 将 watcher 实例挂载到 Dep.target 上
    // 触发属性的 getter，添加监听
    this.getVal(this.vm, this.expOrFn);
    // 添加完监听，清除 Dep.target，防止重复添加
    Dep.target = null;
  }
  // update 方法会被 Dep 调用
  update() {
    // 调用 cb，更新视图
    this.cb && this.cb();
  }
}