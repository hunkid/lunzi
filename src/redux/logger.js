/**
 * 根据logger中间件，理解Redux中间件的写法、applyMiddlewares的实现
 * @file
 */

export const createLogger = store => next => action => {
  
  console.group(action.type)
  console.info('previous state', store.getState())
  console.info('dispatching', action)

  let result = next(action)

  console.log('next state', store.getState())
  console.groupEnd(action.type)
  
  return result
}
