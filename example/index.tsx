import * as React from 'react'
import { render } from 'react-dom'

import { Tree } from '../src/Tree'

const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos', children: [{value: 'phobos', label: 'Phobos-1'}] },
    { value: 'deimos', label: 'Deimos' },
  ],
},{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos', children: [{value: 'phobos', label: 'Phobos-1'}] },
    { value: 'deimos', label: 'Deimos' },
  ],
}];

const NodeComponent: React.SFC<any> = ({node, toggleExpansion, onClick}) => {
  const handleClick = () => {
    toggleExpansion()
    onClick()
  }
  return <div onClick={handleClick}>{node.label}</div>
}

render(
  <Tree data={nodes} NodeComponent={NodeComponent} onNodeClick={node => console.log(node)} />,
  document.getElementById('root')
)
