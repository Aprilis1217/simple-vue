let uid = 0
/**
 * Dep 类
 * 用来管理 Watcher 对象
 * 触发 Watcher 对象的 update 方法
 */
export default class Dep {
  constructor() {
    // 用来存放 Watcher 对象的数组
    this.subs = [];
    // 用来标识当前 Dep 对象
    this.uid = uid++;
  }
  // & 添加观察者
  addSub(watcher) {
    // & 判断观察者是否存在、是否拥有update且typeof为function
    if (watcher && watcher.update && typeof watcher.update === "function") {
      this.subs.push(watcher);
    }
    // this.subs.push(watcher);
  }
  // 发送通知 ===> 触发观察者的 update 方法
  notify() {
    // & 触发每个观察者的更新方法
    if (this.subs.length) {
      console.log(this.subs, 'this.subs')
      // 遍历所有的 Watcher 对象，调用 Watcher 对象的 update 方法
      this.subs.forEach(sub => {
        console.log(sub, 'sub')
        sub && sub.update && sub.update();
      })
    }
  }
}