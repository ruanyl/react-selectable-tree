import * as React from 'react';
import {T} from './utils';

export interface NodeComponentProps {
  node?: any;
  level?: number;
  selectable?: boolean;
  selections?: any;
  checked?: boolean;
  indeterminate?: boolean;
  toggleExpansion?: (e?: any) => void;
  toggleSelection?: (e?: any) => void;
}

interface NodeProps {
  node: any; // the node data
  NodeComponent: React.ComponentType<any>;
  selections?: any;
  checked?: boolean;
  indeterminate?: boolean;
  level?: number;
  onClick?: (item: any) => any;
  onToggle?: (item: any) => any;
  selectable?: boolean;
  query?: string;
  passedProps?: {[key: string]: any};
}

interface DefaultNodeProps {
  checked: boolean;
  indeterminate: boolean;
  level: number;
  onClick: (item?: any) => any;
  onToggle: (item?: any) => any;
  selectable: boolean;
}

interface State {
  expanded: boolean;
}

export class Node extends React.PureComponent<NodeProps, State> {
  static defaultProps: DefaultNodeProps = {
    checked: false,
    indeterminate: false,
    level: 1,
    onClick: T,
    onToggle: T,
    selectable: false,
  };

  state: State;

  constructor(props: NodeProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpansion = (e: any) => {
    e.stopPropagation();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  onToggle = () => {
    const {node} = this.props;
    this.props.onToggle!(node);
  }

  onClick = (e: any) => {
    // should not bubble up to parent node
    e.stopPropagation();
    const {node} = this.props;
    this.props.onClick!(node);
  }

  render() {
    const {NodeComponent, ...props} = this.props;
    return (
      <React.Fragment>
        <NodeComponent
          {...props}
          expanded={this.state.expanded}
          toggleExpansion={this.toggleExpansion}
          toggleSelection={this.onToggle}
        />
        {this.state.expanded && !!this.props.children ? <div className="sub-list">{this.props.children}</div> : null}
      </React.Fragment>
    );
  }
}
