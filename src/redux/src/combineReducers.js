/**
 * 返回一个reducer函数，reducer函数接收state、action两个参数
 * @param {Object} reducers
 */
export default function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action)
      return nextState
    }, {})
  }
}