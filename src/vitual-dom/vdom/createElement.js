import {isVNode, isVText} from '../vnode/judgeType.js'
import applyProperties from './applyProperties'

export default function createElement(node, opts) {
  if (isVText(node)) {
    return document.createTextNode(node.text)
  } else if (!isVNode(node)) {
    console.warn('Vnode input error')
    return null
  }

  var el = (node.namespace === null) ?
      document.createElement(node.tagName) :
      document.createElementNS(node.namespace, node.tagName)
  
  applyProperties(node, node.properties)

  node.children.forEach((child) => {
    let childEl = createElement(child, opts)
    childEl && el.appendChild(childEl)
  })

  return el
}