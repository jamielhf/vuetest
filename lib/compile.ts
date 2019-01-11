import compileUtil from './compileUtil';

export default class Compile  {
  $el: any;
  $fragment: any
  $vm: any;
  constructor(el: any, vm: any) {
    this.$el = document.querySelector(el);
    this.$vm = vm;
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
  }
  /**
   * 循环解析编译节点
   * @param el 
   */
  compileElement(el: any) {
    var childNodes = el.childNodes;
    [].slice.call(childNodes).forEach((node: any) => {
        var text = node.textContent;
        var reg = /\{\{(.*)\}\}/;    // 表达式文本
        // 按元素节点方式编译
        if (this.isElementNode(node)) {
          this.compile(node);
        } else if (this.isTextNode(node) && reg.test(text)) {
          console.log(RegExp.$1);
          compileUtil.text(node, this.$vm, RegExp.$1);
        }
        // 遍历编译子节点
        if (node.childNodes && node.childNodes.length) {
          this.compileElement(node);
        }
    });
  }
  compile(node: any) {
    var nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach((attr: any) => {
        var attrName = attr.name;
        if (this.isDirective(attrName)) {
            var exp = attr.value;
            var dir = attrName.substring(2);
            // 事件指令
            if (this.isEventDirective(dir)) {
                compileUtil.eventHandler(node, this.$vm, exp, dir);
                // 普通指令
            } else {
               if(compileUtil[dir]) {
                 compileUtil[dir](node, this.$vm, exp);
               }
            }

            node.removeAttribute(attrName);
        }
    });
  } 
  /**
   * 是否dom节点
   * @param node 
   */
  isElementNode (node: any) {
    return node.nodeType == 1;
  }
  isTextNode(node: any) {
    return node.nodeType == 3;
  }
  /**
   * 属性上是否有v-
   * @param attr 
   */
  isDirective (attr: any) {
    return attr.indexOf('v-') == 0;
  }
  isEventDirective (dir: string) {
    return dir.indexOf('on') === 0;
  }
  init() {
    this.compileElement(this.$fragment); 
  }
  node2Fragment(el: any) {
    var fragment = document.createDocumentFragment(), child;
    
    // 将原生节点拷贝到fragment
    while (child = el.firstChild) {
        fragment.appendChild(child);
    }
    return fragment;
  }
}