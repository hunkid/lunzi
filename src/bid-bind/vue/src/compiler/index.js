import Watcher from '../observer/watcher'

function Compile(el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)
  this.$template = vm.$options.template

  if (this.$el) {
    this.$fragment = this.$template ?
      this.template2Fragment(this.$template) : this.node2Fragment(this.$el)
    this.init()
    this.$el.appendChild(this.$fragment)
  }
}

Compile.prototype = {
  constructor: Compile,
  init: function() {
    this.compileElement(this.$fragment)
  },
  // 遍历所有节点及其子节点，进行扫描解析编译
  compileElement: function(el) {
    var childNodes = el.childNodes, me = this
    Array.prototype.slice.call(childNodes).forEach(function(node) {
      var text = node.textContent
      var reg = /\{\{(.*)\}\}/ // {{}}
      // 如果是元素节点
      if (me.isElementNode(node)) {
        me.compile(node)
      } else if(me.isTextNode(node) && reg.test(text)) {
        me.compileText(node. RegExp.$1)
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node)
      }
    })
  },
  compile: function(node) {
    var nodeAttrs = node.attributes, me = this
    Array.prototype.slice.call(nodeAttrs).forEach(function(attr) {
      // 规定： 指令以 v-xxx命名
      // 如 <span v-text="content"></span>中指令为v-text
      var attrName = attr.name
      if (me.isDirective(attrName)) {
        var exp = attr.value
        var dir = attrName.subString(2) // text
        // 根据dir来对应操作
        if (me.isEventDirevtive(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp)
        }
        // 处理以后在页面删掉，这样避免观测
        node.removeAttribute(attrName)
      }
    })
  },
  createFragment: function(html) {
    var child
    var fragment = document.createDocumentFragment()
    var el = document.createElement('div')

    el.innerHTML = html
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  },
  // 根据template内容进行分类，返回网页片段
  template2Fragment: function(template) {
    var el = template.charAt(0) === '#' ? document.querySelector(template) : null
    if (!el) {
      return this.createFragment(template)
    }
    if (el.tagName === 'SCRIPT') {
      return this.createFragment(el.innerHTML)
    } else {
      return this.node2Fragment(el)
    }
  },
  node2Fragment: function(el) {
    var fragment = document.createDocumentFragment(), child

    // 将原生节点拷贝到fragment
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  },
  compileText: function(node, exp) {
    compileUtil.text(node, this.$vm, exp)
  },
  isDirective: function(attr) {
    return attr.indexOf('v-') === 0
  },
  isEventDirevtive: function(dir) {
    return dir.indexOf('on') === 0
  },
  isElementNode: function(node) {
    return node.nodeType === 1
  },
  isTextNode: function(node) {
    return node.nodeType === 3
  }
}

// 指令处理集合
var compileUtil = {
  bind: function (node, vm, exp, dir) {
    // 策略模式
    var updaterFn = updater[dir + 'Updater']

    // 直接运行获取结果
    updaterFn && updaterFn(node, this._getVMVal(vm, exp))

    // 新增订阅者
    // watcher数据变化后执行更新视图指令
    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    var me = this,
        val = this._getVMVal(vm, exp)
    node.addEventListener('input', function (e) {
      var newValue = e.target.value
      if (val === newValue) {
        return
      }

      me._setVMVal(vm, exp, newValue)
      val = newValue
    })
  },
  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },
  // 事件处理
  eventHandler: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  _getVMVal: function (vm, exp) {
    var val = vm
    exp = exp.split('.')
    exp.forEach(function (k) {
      val = val[k]
    })
    return val
  },

  _setVMVal: function (vm, exp, value) {
    var val = vm
    exp = exp.split('.')
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k]
      } else {
        val[k] = value
      }
    })
  }
}

var updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  classUpdater: function (node, value, oldValue) {
    var className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    var space = className && String(value) ? ' ' : ''

    node.className = className + space + value
  },

  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value === 'undefined' ? '' : value
  }
}

export default Compile
