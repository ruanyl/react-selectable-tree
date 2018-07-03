import * as React from 'react';
import {F, _, resolveChildren} from './utils';

import {Node} from './Node';

type ChildrenResolver = (item: any) => any;

export interface GeneralTreeProps{
  NodeComponent: React.ComponentType<any>;
  selections?: any;
  isExpandable?: (item?: any, level?: number) => boolean;
  resolveChildren?: ChildrenResolver;
  onClick?: (item?: any) => any;
  onSelectionChanged?: () => void;
  onToggle?: (item?: any) => any;
  selectedIndex?: number;
  shouldDetach?: (item?: any) => boolean;
  shouldAlwaysExpand?: (item?: any) => boolean;
  query?: string;
  passedProps?: {[key: string]: any};
}

export interface TreeProps extends GeneralTreeProps {
  data: any[];
}

interface DefaultTreeProps {
  isExpandable: (item?: any, level?: number) => boolean;
  resolveChildren: ChildrenResolver;
  onSelectionChanged: () => void;
  onToggle: (item?: any) => any;
  shouldDetach: (item?: any) => boolean;
}

const isExpandable = (item: any) => {
  const children = resolveChildren(item)
  return children && children.length > 0
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
  });
};

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
  });
};

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
    return item.checked ? 1 : 0;
  }

  // node is checked
  if (isEveryChildChecked(item, resolver)) {
    return 1;
  }

  // node is indeterminate
  if (isSomeChildChecked(item, resolver)) {
    return -1;
  }
};

/**
 * Tree accepts an array of items, for example: [item1, item2]
 */
export class Tree extends React.PureComponent<TreeProps, {}> {
  static defaultProps: DefaultTreeProps = {
    isExpandable,
    resolveChildren,
    onSelectionChanged: _,
    onToggle: _,
    shouldDetach: F,
  };

  toggledItems(item: any, checked: boolean, isCurrentSelectedItem: boolean = false) {
    const {resolveChildren, shouldDetach} = this.props;
    // do not select a detached node if it's not the current selected node
    if (checked && !isCurrentSelectedItem && shouldDetach!(item)) {
      return
    }
    if (item.checked !== checked) {
      item.checked = checked
    }
    const children = resolveChildren!(item)
    if (children && children.length > 0) {
      children.forEach((child: any) => {
        this.toggledItems(child, checked);
      });
    }
  }

  /**
   * when toggle node, `unselected/indeterminate` become `selected`
   * `selected` become `unselected`
   * when toggle a node, it will go through and update all it's children
   */
  onToggle = (item: any) => {
    if (item.selectable) {
      const checked = !getCheckState(item, this.props.resolveChildren!);
      this.props.onToggle!(item); // handle the change of current node

      this.toggledItems(item, checked, true);
      this.props.onSelectionChanged!(); // handle the change of current node and all its children
    }
  }

  renderNode = (d: any, n: number, level: number) => {
    const {data, isExpandable, resolveChildren, ...props} = this.props;
    const expandable = isExpandable!(d, level);
    const checkState = getCheckState(d, resolveChildren!);

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
    );
  }

  render() {
    const {data} = this.props;
    return (
      <div className="rs-tree">
      { data.map((d: any, n: number) => this.renderNode(d, n, 1)) }
      </div>
    );
  }
}
