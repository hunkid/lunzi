/**
 * 实现最核心的东西，不对reducer类型等做检测，暂未考虑健壮性
 * reducer必须：1.纯函数；2.未改变的state其余部分，原样返回
 * createStore制造出来需要dispatch一次，这样可以使最初的store不会undefined，这里还没做
 * @param {object} state 
 * @param {function} reducer 
 */
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer, preloadedState)
  }
  let state = preloadedState
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  return {getState, dispatch, subscribe}
  
}