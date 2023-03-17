import compileElementNode from "./compileElementNode.js";
import compileTextNode from "./compileTextNode.js";
/**
 * Compile 类
 * 编译模板，解析指令/插值表达式
 * 将模板中的变量替换成数据，初始化渲染页面视图
 * 数据变化后，更新渲染视图
 */
export default class Compile {
  constructor(vm) {
    const el = vm.$el;
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    if (this.el) {
      // ! 1. 把真实 DOM 移入到内存中 fragment
      const fragment = this.nodefragment(this.el);
      // ! 2. 编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
      this.compileNode(fragment);
      // ! 3. 把编译好的 fragment 塞回到页面中
      this.el.appendChild(fragment);
    }
  }
  // & node.firstchild & node.childNodes会保留空白节点，避免使用node.children
  nodefragment(el) {
    // 创建文档碎片
    const fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  compileNode(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        // 编译元素节点
        compileElementNode(node, this.vm);
      } else {
        // 编译文本节点
        compileTextNode(node, this.vm);
      }
      // 如果当前节点还有子节点，需要递归调用 compileNode
      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node);
      }
    });
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node && node.nodeType === 1;
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node && node.nodeType === 3;
  }
  // 判断元素属性是否是 vue 指令
  isDirective(attrName) {
    return attrName && attrName.includes('v-');
  }
}