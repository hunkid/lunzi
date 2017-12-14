import {
  createStore,
  applyMiddleware
} from '../src/index.js'
import {
  createLogger
} from '../logger.js'
import reducer from './reducer.js'

var store = createStore(reducer, applyMiddleware(createLogger))
store.dispatch({
  type: 'noop'
})
store.dispatch({
  type: 'LEFT'
})
// console.log(store.getState())