import Dep from './dep'
import {
  def,
  hasOwn,
  isObject
} from '../util/index'

function Observer(value) {
  this.value = value
  this.dep = new Dep() // TO UNDERSTAND 这里要观察依赖者做啥？ 用于监听到属性的更改，不能监听到属性的删除与添加
  def(value, '__ob__', this)
  if (Array.isArray(value)) {
    // TODO: observeArray
  } else {
    this.walk(value)
  }
}
Observer.prototype = {
  constructor: Observer,
  // 用于遍历
  walk: function (value) {
    var that = this
    Object.keys(value).forEach(function (key) {
      // that.walk(value[key]) TODO
      that.convert(value, key)
    })
  },
  // 用于转化成可响应的
  convert: function (value, key) {
    defineReactive(value, key, value[key])
  }
}
export function defineReactive(obj, key, val) {
  var dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)

  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  var childObj = observe(val) // 深度观察
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get: function () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
      }
      if (childOb) {
        // 将当前的 watcher 传递给子对象的 数据对象的观察员集合
        childOb.dep.depend()
      }
      return val
    },
    set: function (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      console.log('我被改变成：' + newVal)
      val = newVal
      childObj = observe(newVal)
      dep.notify()
    }
  })
}
export function observe(value) {
  if (!isObject(value)) {
    return
  }
  var ob
  if (hasOwn(value, 'ob') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}
