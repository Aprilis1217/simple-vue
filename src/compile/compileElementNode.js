import Watcher from '../watcher/index.js';

// compileElementNode.js ===> 编译元素
export default function (node, vm) {
  // 获取到元素节点上面的所有属性进行遍历
  const attrs = node.attributes;
  for (let i = 0, len = attrs.length; i < len; i++) {
    const key = attrs[i].name;
    const attrVal = node.getAttribute(key) || '';
    const expr = attrVal.trim();
    const valExpr = 'vm.' + expr;
    if (key === 'v-model') {
      const watchCb = () => {
        node.value = eval(valExpr);
      };
      node.addEventListener('input', (e) => {
        eval(`${valExpr}="${e.target.value}"`);
      });
      new Watcher(vm, [expr], watchCb);
      watchCb();
    }
    if (key === 'v-if') {
      const watchCb = () => {
        node.style.display = eval(`Boolean(${valExpr})`) ? 'block' : 'none';
      };
      new Watcher(vm, [expr], watchCb);
      watchCb();
    }
  }
}