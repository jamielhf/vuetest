/**
 * Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是:
1、在自身实例化时往属性订阅器(dep)里面添加自己
2、自身必须有一个update()方法
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
 */

// const dep = new Dep();

export default class Watch {
  cb: any;
  vm: any;
  exp: any;
  value: any;
  constructor(vm:any, exp: any, cb: any) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get(); 
  }
  update() {
    this.run();    // 属性值变化收到通知
  }
  run() {
      var value = this.get(); // 取到最新值
      var oldVal = this.value;
      if (value !== oldVal) {
        this.value = value;
        this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
      }
  }
  get() {
      window.dep.target = this;    // 将当前订阅者指向自己
      var value = this.vm[this.exp];    // 触发getter，添加自己到属性订阅器中
      window.dep.target = null;    // 添加完毕，重置
      return value;
  }
}

