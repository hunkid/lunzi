import Dep, {pushTarget, popTarget} from './dep'

function Watcher(vm, expOrFn, cb, options = {}) {
  this.cb = cb
  this.vm = vm
  this.expOrFn = expOrFn
  this.depIds = {}
  this.newDepIds = {}

  vm._watcher.push(this)
  this.lazy = !!options.lazy
  this.dirty = this.lazy

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  } else {
    this.getter = this.parseGetter(expOrFn)
  }

  // 观察员 value
  this.value = this.lazy
  ? undefined
  : this.get()

  console.log('watcher的get是')
  console.log(this.getter)
}

Watcher.prototype = {
  constructor: Watcher,
  update: function() {
    // 如果为计算属性的watcher，则延缓更新。设置数据为dirty
    if (this.lazy) {
      this.dirty = true
    } else {
      // 数据对象直接更新
      this.run()
    }
  },
  // 非计算属性获取value
  run: function () {
    var value = this.get()
    var oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      // 更新视图的指令
      this.cb.call(this.vm, value, oldVal)
    }
  },
  addDep: function(dep) {
    if (!this.newDepIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.newDepIds[dep.id] = dep
    }
  },

  get: function() {
    pushTarget(this)
    const vm = this.vm
    let value = this.getter && this.getter.call(vm, vm)

    popTarget()
    this.cleanupDeps()
    return value
  },

  evaluate: function () {
    this.value = this.get()
    this.dirty = false
  },
  /**
   * Depend on all deps collected by this watcher.
   */
  depend: function () {
    let maps = Object.keys(this.depIds)
    maps.forEach((key) => {
      this.depIds[key].depend()
    })
  },

  cleanupDeps: function() {
    let keys = Object.keys(this.depIds)
    keys.forEach((key) => {
      const dep = this.depIds[key]
      // 删除旧的观察者依赖
      if (!this.newDepIds.hasOwnProperty(dep.id)) {
        dep.removeSub(this)
      }
    })

    this.depIds = this.newDepIds;
    this.newDepIds = Object.create(null)
  },
  parseGetter: function (exp) {
    if (/[^\w.$]/.test(exp)) {
      return;
    }
    var exps = exp.split('.')

    /**
     * @param {object} obj
     */
    return function (obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return
        obj = obj[exps[i]]
      }
      return obj
    }
  }
}

export default Watcher
