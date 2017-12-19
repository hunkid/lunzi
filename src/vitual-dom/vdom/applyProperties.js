
/**
 * 目前只考虑props最多为二级object，及不存在{key: {}}的形式，最多{key: num}
 * 也没有考虑value的情况，input、textarea的差异
 * @param {VirtualNode} vnode 
 * @param {Object} props 
 */
export default function applyProperties(vnode, props) {
  for(var propKey in props) {
    if (props.hasOwnProperty(propKey)) {
      let propVal = props[propKey]
      if (propVal !== undefined) {
        vnode.setAttribute(propKey, propVal)        
      } else {
        vnode.removeAttribute(propKey)
      }
    }
  }
}
