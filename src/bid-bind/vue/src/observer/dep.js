var uid = 0
/**
 * 消息订阅器
 */
function Dep() {
  this.id = uid++
    this.subs = []
}
Dep.prototype = {
  constructor: Dep,
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      if (sub.update && typeof sub.update === 'function') {
        sub.update()
      }
    })
  },
  depend: function () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  },
  removeSub: function (sub) {
    var index = this.subs.indexOf(sub)
    if (index != -1) {
      this.subs.splice(index, 1)
    }
  }
}
Dep.target = null

const targetStack = []

export function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target)
  }
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}

export default Dep