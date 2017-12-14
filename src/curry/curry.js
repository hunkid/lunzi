/**
 * 函数柯里化目的在于函数复用、延迟使用等，对于优化方法比较方便，达到一个值进去，一个状态出来的效果
 * 定义：
 * 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。
 * @file
 */

function curry(fn) {
  var args = [].slice.call(arguments, 1)
  return function() {
    var newArgs
    newArgs = args.concat([].slice.call(arguments))
    return fn.apply(null, newArgs)
  }
}

function add(n1, n2) {
  return n1 + n2
}

function test() {
  console.log('我这些参数是合法的:')
  console.log([].slice.call(arguments).join(';'))
}
var m = curry(test, '是')(1)
console.log(m)
