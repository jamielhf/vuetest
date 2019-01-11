
import Watcher from './watch';

var updater: any = {
  textUpdater: function(node: any, value: any) {
    console.log(value);
    node.textContent = typeof value == 'undefined' ? '' : value;
  },

  htmlUpdater: function(node: any, value: any) {
      node.innerHTML = typeof value == 'undefined' ? '' : value;
  },

  modelUpdater: function(node: any, value: any, oldValue: any) {
      node.value = typeof value == 'undefined' ? '' : value;
  }
};

const compileUtil: any = {
  eventHandler(node: any, vm: any, exp: any, dir: string) {
    var eventType = dir.split(':')[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  text(node: any, vm: any, exp: any) {
    this.bind(node, vm, exp, 'text');
  },
  model(node: any, vm: any, exp: any) {
    this.bind(node, vm, exp, 'model');

    var val = this._getVMVal(vm, exp);
        console.log('111', val);
    node.addEventListener('input', (e: any) =>{
        var newValue = e.target.value;
        if (val === newValue) {
            return;
        }

        this._setVMVal(vm, exp, newValue);
        val = newValue;
    });
  },
  bind(node: any, vm: any, exp: any, dir: any) {
    var updaterFn: any = updater[dir + 'Updater'];

    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function(value: any, oldValue: any) {
        updaterFn && updaterFn(node, value, oldValue);
    });
  },
  _setVMVal(vm: any, exp: any, value: any) {
    var val = vm;
    exp = exp.split('.');
    exp.forEach(function(k: any, i: any) {
        // 非最后一个key，更新val的值
        if (i < exp.length - 1) {
            val = val[k];
        } else {
            val[k] = value;
        }
    });
  },
  _getVMVal(vm: any, exp: any) {
    var val = vm;
    exp = exp.split('.');
    exp.forEach(function(k: any) {
        val = val[k];
    });
    return val;
  },
}


export default compileUtil