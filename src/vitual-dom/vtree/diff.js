import {REPLACE, ATTRS, TEXT, REORDER} from './constants.js'
import {isVNode, isVText} from '../vnode/judgeType.js'
import listDiff from './listDiff.js'

function diff(oldTree, newTree) {
  let index = 0
  let patches = {}
  walk(oldTree, newTree, index, patches)
  return patches
}

function walk(oldNode, newNode, index, patches) {
  let currentPatches = []
  // 如果oldNode被remove掉了
  if(newNode === undefined || newNode === null) {
    // 先不做操作, 具体交给 list diff 处理
  } else if (isVText(newNode) && isVText(oldNode)) {
    if(newNode.text !== oldNode.text) {
      currentPatches.push(newNode.text)
    }
  } else if (isVNode(newNode) && isVNode(oldNode)) {
    if(newNode.tagName === oldNode.tagName &&
       newNode.key === oldNode.key) {
      let attrsPatches = diffAttrs(oldNode, newNode)
      if (attrsPatches) {
        currentPatches.push({ type: ATTRS, attrs: attrsPatches })
      }
      diffChildren(oldNode.children, newNode.children, index, patches)
    }
  } else {
    currentPatches.push({ type: REPLACE, node: newNode})
  }

  if (currentPatches.length) {
    patches[index] = currentPatch
  }
}

function diffAttrs (oldNode, newNode) {
  let count = 0
  let oldAttrs = oldNode.properties
  let newAttrs = newNode.properties

  let key, value
  let attrsPatches = {}

  // 如果存在不同的 attrs
  for (key in oldAttrs) {
    value = oldAttrs[key]
    // 如果 oldAttrs 移除掉一些 attrs, newAttrs[key] === undefined
    if (newAttrs[key] !== value) {
      count++
      attrsPatches[key] = newAttrs[key]
    }
  }
  // 如果存在新的 attr
  for (key in newAttrs) {
    value = newAttrs[key]
    if (!oldAttrs.hasOwnProperty(key)) {
      count++
      attrsPatches[key] = value
    }
  }

  if (count === 0) {
    return null
  }

  return attrsPatches
}

let key_id = 0
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  let diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    let reorderPatch = { type: REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }

  // 存放当前node的标识，初始化值为 0
  let currentNodeIndex = index

  oldChildren.forEach((child, i) => {
    key_id++
    let newChild = newChildren[i]
    currentNodeIndex = key_id

    // 递归继续比较
    walk(child, newChild, currentNodeIndex, patches)
  })
}
