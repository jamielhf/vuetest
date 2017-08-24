//监听数据变化
function observe (value) {

    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听
    if(!value ){
        return
    }

    return new Observer(value)


}
//监听数据变化
class Observer{
    constructor(value){
        this.value = value
        this.walk(value)
    }
    walk(value){
        Object.keys(value).forEach(key => {
            console.log(value)
            this.convert(key, value[key])
        })
    }
    convert(key, val){

        defineReactive(this.value, key, val)
    }
}


function defineReactive (vm, key, val) {


        let dep = new Dep();

        if(typeof(val)=='object'){

              observe(val);
              return
        }

        //https://developer.mozilla.org/cn/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        Object.defineProperty(vm, key, {
            configurable:true,
            enumerable:true,
            get: function () {

                // 如果Dep类存在target属性，将其添加到dep实例的subs数组中
                // target指向一个Watcher实例，每个Watcher都是一个订阅者
                // Watcher实例在实例化过程中，会读取data中的某个属性，从而触发当前get方法
                // 此处的问题是：并不是每次Dep.target有值时都需要添加到订阅者管理员中去管理，需要对订阅者去重，不影响整体思路，不去管它


                if (Dep.target) dep.addSub(Dep.target);

                return val
            },
            set: function (newVal) {

                if(val === newVal) return
                val = newVal
                // 对新值进行监听
                if(typeof(newVal)=='object'){
                    observe(newVal);
                }
                // 通知所有订阅者，数值被改变了
                dep.notify();
            }
        });




}

function nodeToFragment (node, vm) {
    //文档碎片
    let flag = document.createDocumentFragment();
    let child;

    while (child = node.firstChild) {

        compile(child, vm);

        flag.appendChild(child); // 将子节点劫持到文档片段中
    }

    return flag;
}
//解析命令
function compile (node, vm) {
    let reg = /\{\{(.*)\}\}/;


    if (node.nodeType === 1) {
        let attr = node.attributes;
        let name;
        // 解析属性
        for (let i = 0; i < attr.length; i++) {
            if (attr[i].nodeName == 'v-model') {
                name = attr[i].nodeValue; // 获取v-model绑定的属性名
                node.addEventListener('input', function (e) {
                    // 给相应的data属性赋值，进而触发该属性的set方法
                    vm[name] = e.target.value;
                });

                node.value = vm[name]; // 将data的值赋给该node

                node.removeAttribute('v-model');
            }
        };
        new Watcher(vm, node, name, 'input');
    }
    // 节点类型为text
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            let name = RegExp.$1; // 获取匹配到的字符串

            name = name.trim();



            new Watcher(vm, node, name, 'text');
        }
    }
}
//订阅者
function Watcher (vm, node, name, nodeType) {

    Dep.target = this;
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.nodeType = nodeType;
    this.update();
    Dep.target = null;
}

Watcher.prototype = {
    update: function () {
        this.get();
        if (this.nodeType == 'text') {

            this.node.nodeValue = this.value;

        }
        if (this.nodeType == 'input') {

            this.node.value = this.value;
        }
    },
    // 获取data中的属性值
    get: function () {
        let arr = this.name.split('.');







        this.value = this.vm[this.name];

        // 触发相应属性的get
        // 添加订阅者watcher到主题对象Dep
        //再把Dep.target设置为null
    }
}
//id
let uid = 0;
//Dep用于订阅者的存储和收集
function Dep () {
    this.id = uid++;
    this.subs = []
}
Dep.prototype = {
    addSub: function(sub) {

        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
function Vue (options) {
    this.data = options.data;
    let data = this.data;

    // Object.keys(data).forEach(key => this._proxy(key))

    // 监听数据
    observe(data)


    let id = options.el;

    let dom = nodeToFragment(document.getElementById(id), data);
    // 编译完成后，将dom返回到app中
    document.getElementById(id).appendChild(dom);
}


//实例化
let vm = new Vue({
    el: 'app',
    data: {
        text: 'hello world1',
        text2: 'haha',
        d:{
            a:123
        }
    },
    method(){

    }
});