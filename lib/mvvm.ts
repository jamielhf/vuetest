import Observer from './observer';
import Compile from './compile';
import Dep from './dep';

window.dep = new Dep();

export default class MVVM {
  data: any;
  constructor(options: any ) {
    this.data = options.data;
    new Observer(this.data, this);
    new Compile(options.el, this);
  }
}

