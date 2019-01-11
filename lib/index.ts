
import MVVM from './mvvm';
var vm: any = new MVVM({
  el: '#mvvm-app',
  data: {
      someStr: 'hello',
      text: 'hello jamie',
  },
});

console.log(vm);
setTimeout(()=>{
  vm.text = 2;
},1000)

