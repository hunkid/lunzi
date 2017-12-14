/**
 * 中间件：其实就是在dispatch Action前后，对目前所在的环境变量进行保存，根据Action进行阶段性工作
 * 后将Action传入其他计算方式
 * applyMiddleware 执行过后返回一个闭包函数，目的是将创建 store的步骤放在这个闭包内执行，这样 middleware 就可以共享 store 对象。
 * @file
 */

export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return { ...store,
      dispatch
    }
  }
}

/**
 * 将多个函数串联，上一个函数的输出是下一个函数的输入，作为整体函数
 */
function compose(...funcs) {
  var newFuncs = funcs.filter((func) => {
    return typeof func === 'function'
  })
  if (!newFuncs.length) {
    return arg => arg
  }
  if (newFuncs.length === 1) {
    return newFuncs[0]
  }
  var lastFunc = newFuncs[newFuncs.length - 1]
  var restFunc = newFuncs.slice(0, -1)
  return function (...args) {
    // var lastFunc = newFuncs[]
    // if (length) {
    //   result = newFuncs[0].apply(this, args)
    // }
    // while(++index < length) {
    //   result = newFuncs[index].call(this, result)
    // }
    // return result
    restFunc.reduceRight((result, f) => f(result), lastFunc(...args))
  }
}