import * as React from 'react'
import {T} from './utils'

interface NodeProps {
  node: any // the node data
  NodeComponent: React.ComponentType<any>
  checked?: boolean
  indeterminate?: boolean
  level?: number
  onNodeClick?: (item: any) => any
  onToggle?: (item: any) => any
  selectable?: boolean
  passedProps?: {[key: string]: any}
}

interface DefaultNodeProps {
  checked: boolean
  indeterminate: boolean
  level: number
  onNodeClick: (item?: any) => any
  onToggle: (item?: any) => any
  selectable: boolean
}

interface State {
  expanded: boolean
}

export class Node extends React.PureComponent<NodeProps, State> {
  static defaultProps: DefaultNodeProps = {
    checked: false,
    indeterminate: false,
    level: 1,
    onNodeClick: T,
    onToggle: T,
    selectable: false,
  }

  state: State

  constructor(props: NodeProps) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  toggleExpansion = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  onToggle = () => {
    const {node} = this.props
    this.props.onToggle!(node)
  }

  onNodeClick = () => {
    const {node} = this.props
    this.props.onNodeClick!(node)
  }

  render() {
    const {NodeComponent, ...props} = this.props
    return (
      <React.Fragment>
        <NodeComponent
          {...props}
          expanded={this.state.expanded}
          toggleExpansion={this.toggleExpansion}
          toggleSelection={this.onToggle}
          onClick={this.onNodeClick}
        />
        {this.state.expanded && !!this.props.children ? <div className="sub-list">{this.props.children}</div> : null}
      </React.Fragment>
    )
  }
}
