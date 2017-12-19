
export function isVNode(node) {
  return node.type === 'VirtualNode'
}

export function isVText(node) {
  return node.type === 'VirtualText'
}