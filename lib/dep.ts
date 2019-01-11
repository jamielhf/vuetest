export default class Dep {
    subs: any = [];
    target: any = null;
    addSub (sub: any) {
        this.subs.push(sub);
        console.log('subs', sub);
    }
    notify () {
        this.subs.forEach(function(sub: any) {
            sub.update();
        });
    }
    depend() {
        // this.target.addDep(this);
    }
    removeSub(sub: any) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }
}

