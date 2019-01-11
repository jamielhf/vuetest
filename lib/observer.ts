
export default class Observer {
    $vm: any;
    constructor (data: any , vm: any,) {
        this.$vm = vm;
        this.observer(data);
    }
    observer(data: any) {
        if(!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(key, data[key]);
        })
    }
    defineReactive(key: any, val: any) {
        this.observer(val); // 监听子属性
        Object.defineProperty(this.$vm, key, {
            configurable: false, // 不能再define
            enumerable: true, // 可枚举
            get() {
                if(window.dep.target) {
                    window.dep.addSub(window.dep.target);
                }
                return val;
            },
            set(newVal) {
                console.log('监听到值变化了 ', val, ' --> ', newVal);
                val = newVal;
                window.dep.notify();
            }
        }) 
    }
}


