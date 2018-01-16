
function DataBinder(objectId) {

  // 用于发布订阅器
  var pubSub = {
    callbacks: {},

    on: function(msg, callback) {
      this.callbacks[msg] = this.callbacks[msg] || []
      this.callbacks[msg].push(callback)
    },

    publish: function(msg) {
      this.callbacks[msg] = this.callbacks[msg] || []
      for (var i = 0; i < this.callbacks[msg].length; i++) {
        var argument = [].slice.call(arguments, 1)
        this.callbacks[msg][i].apply(this, argument)
      }
    }
  }
  var dataAttr = 'data-bind-' + objectId,
      modelChangeMsg = objectId + ':change',
      viewChangeMsg = objectId + ':view-change'

  // 订阅model变化 -> 视图更新
  pubSub.on(modelChangeMsg, function(propName, newVal) {
    var elements = document.querySelectorAll('[' + dataAttr + '=' + propName + ']'), tagName
    for (var i = 0, n = elements.length; i < n; i++) {
      tagName = elements[i].tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        elements[i].value = newVal
      } else {
        elements[i].innerHTML = newVal
      }
    }
  })

  // 视图变化，则触发更新
  document.addEventListener('input', function(e) {
    var el = e.target
    var propName = el.getAttribute(dataAttr)
    var tagName = el.tagName.toLowerCase()
    if (propName) {
      var newVal
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        newVal = el.value
      } else {
        newVal = el.innerHTML
      }
      pubSub.publish(viewChangeMsg, propName, newVal)
    }
  }, false)

  return pubSub
}

function User(uid) {
  this.properties = {}
  var binder = new DataBinder(uid)
  var user = {
    properties: {},
    _set: function(key, val) {
      this.properties[key] = val
      binder.publish(uid + ':change', key, val)
    },
    _get: function(key) {
      return this.properties(key)
    },
    _binder: binder
  }
  
  // 订阅view变化
  binder.on(uid + ':view-change', function(key, newVal) {
    user._set(key, newVal)  
  })

  return user
}
