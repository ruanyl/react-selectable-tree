export type ChildrenResolver = (item: any) => any

export const T = (p: any) => true
export const F = (p: any) => false
export const _ = function() {}
export const resolveChildren = (node: any) => node.children
/**
 * checked: 1
 * unchecked: 0
 * indeterminate: -1
 */
export const getCheckState = (item: any, resolver: ChildrenResolver) => {
  // do not check children if: 1. node doesn't have children 2. node doesn't have selectable children
  // return the current node `checked` state directly
  const children = resolver(item)
  if (!children || children.length === 0 || children.filter((child: any) => child.selectable).length === 0) {
    return item.checked ? 1 : 0
  }

  // node is checked
  if (isEveryChildChecked(item, resolver)) {
    return 1
  }

  // node is indeterminate
  if (isSomeChildChecked(item, resolver)) {
    return -1
  }
}

/**
 * check if every child is checked, will go deeply to every leaf node
 */
const isEveryChildChecked = (item: any, resolver: ChildrenResolver) => {
  const children = resolver(item)
  return (children || []).every((child: any) => {
    const subChildren = resolver(child)
    if (subChildren && subChildren.length > 0) {
      return isEveryChildChecked(child, resolver)
    }
    // do not take the node which is not selectable into account when determine if all children were checked
    return child.checked && child.selectable
  })
}

/**
 * check if any child of the node is checked, will go deeply to every leaf node
 */
const isSomeChildChecked = (item: any, resolver: ChildrenResolver) => {
  const children = resolver(item)
  return (children || []).some((child: any) => {
    const subChildren = resolver(child)
    if (subChildren && subChildren.length > 0) {
      return isSomeChildChecked(child, resolver)
    }
    return child.checked && child.selectable
  })
}

export const isExpandable = (item: any) => {
  const children = resolveChildren(item)
  return children && children.length > 0
}

