import * as React from 'react'
import {F, T, _, resolveChildren, ChildrenResolver, getCheckState, isExpandable} from './utils'

import {Node} from './Node'

export interface TreeProps<T = any> {
  data: T[]
  NodeComponent: React.ComponentType<any>
  isChecked: (item?: T, level?: number) => boolean
  isExpandable?: (item?: T, level?: number) => boolean
  resolveChildren?: ChildrenResolver
  onNodeClick?: (item?: any) => any
  onSelectionChanged?: () => void
  onToggle?: (item?: any) => any
  selectedIndex?: number
  shouldDetach?: (item?: any) => boolean
  passedProps?: {[key: string]: any}
  isSelectable?: (item?: T, level?: number) => boolean
}

interface FormattedData {
  [key: string]: any
  selectable: boolean
  checkState: -1 | 0 | 1
  expandable: boolean
};

interface DefaultTreeProps {
  isExpandable: (item?: any, level?: number) => boolean
  isSelectable: (item?: any, level?: number) => boolean
  resolveChildren: ChildrenResolver
  onSelectionChanged: () => void
  onToggle: (item?: any) => any
  shouldDetach: (item?: any) => boolean
}

/**
 * Tree accepts an array of items, for example: [item1, item2]
 */
export class Tree<TData> extends React.PureComponent<TreeProps<TData>, {}> {
  static defaultProps: DefaultTreeProps = {
    isExpandable,
    isSelectable: T,
    resolveChildren,
    onSelectionChanged: _,
    onToggle: _,
    shouldDetach: F,
  }

  toggleNode(item: any, checkState: number, isCurrentSelectedItem: boolean = false) {
    const {resolveChildren, shouldDetach} = this.props
    // do not select a detached node if it's not the current selected node
    if (checkState === 1 && !isCurrentSelectedItem && shouldDetach!(item)) {
      return
    }
    if (item.checkState !== checkState) {
      item.checkState = checkState
    }
    const children = resolveChildren!(item)
    if (children && children.length > 0) {
      children.forEach((child: any) => {
        this.toggleNode(child, checkState)
      })
    }
  }

  /**
   * when toggle node, `unselected/indeterminate` become `selected`
   * `selected` become `unselected`
   * when toggle a node, it will go through and update all it's children
   */
  onToggle = (item: any) => {
    if (item.selectable) {
      const checkState  = getCheckState(item, this.props.resolveChildren!)
      this.props.onToggle!(item) // handle the change of current node

      let nextCheckState
      if (checkState === 1 || checkState === -1) {
        nextCheckState = 0
      } else {
        nextCheckState = 1
      }
      this.toggleNode(item, nextCheckState, true)
      this.props.onSelectionChanged!() // handle the change of current node and all its children
    }
  }

  formatData(data: any[]): (TData & FormattedData)[] {
    const {isSelectable, isExpandable, isChecked} = this.props;
    return data.map((d, i) => {
      return {
        ...d,
        selectable: isSelectable!(d, i),
        expandable: isExpandable!(d, i),
        checked: isChecked(d, i)
      }
    });
  }

  renderNode = (d: any, n: number, level: number) => {
    const {data, isExpandable, resolveChildren, ...props} = this.props
    const expandable = isExpandable!(d, level)
    const checkState = getCheckState(d, resolveChildren!)

    return (
      <Node
        key={n}
        node={d}
        level={level}
        checked={checkState === 1}
        indeterminate={checkState === -1}
        selectable={d.selectable}
        onToggle={this.onToggle}
        {...props}
      >
        {expandable ? (
          <React.Fragment>
          { (resolveChildren!(d) || []).map((d: any, n: number) => this.renderNode(d, n, level + 1)) }
          </React.Fragment>
        ) : null}
      </Node>
    )
  }

  render() {
    const {data} = this.props
    return (
      <div className="rs-tree">
      { data.map((d: any, n: number) => this.renderNode(d, n, 1)) }
      </div>
    )
  }
}
