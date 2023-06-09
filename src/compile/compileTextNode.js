import Watcher from '../watcher/index.js';

// compileTextNode.js ===> 编译文本
export default function (node, vm) {
  // 获取节点的文本内容
  const textContent = node.textContent || '';
  let subExprs = [];
  // for example
  // convert  年龄 + {{ user.name }} to "年龄" + vm.user.name
  const expr = textContent
    .replace(/\{\{([^\}]+)\}\}/g, (...args) => {
      let subExpr = args[1].trim();
      if (subExpr) {
        subExprs.push(subExpr);
        // new Watch
        subExpr = 'vm.' + subExpr;
        return subExpr;
      } else {
        return args[0];
      }
    })
    .split('+')
    // result: ['"年龄"', 'vm.user.name']
    .map(item => /^vm/.test(item.trim()) ? item : `"${item}"`)
    // result: "年龄" + vm.user.name
    .join('+');
  if (subExprs.length) {
    const watchCb = () => {
      node.textContent = eval(expr);
    };
    new Watcher(vm, subExprs, watchCb);
    watchCb();
  }
}