import Watcher from '../observer/watcher'
import { observe } from '../observer/observer'
import initMixin from './init'

/**
 * Create a MVVM
 * @class
 */
function MVVM(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof MVVM)) {
    console.warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

MVVM.prototype = {
  constructor: MVVM,
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb, options)
  }
}

initMixin(MVVM)

export default MVVM
