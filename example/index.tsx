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

const NodeComponent: React.SFC<any> = ({node, toggleExpansion}) => {
  return <div onClick={toggleExpansion}>{node.label}</div>
}

render(
  <Tree data={nodes} NodeComponent={NodeComponent} />,
  document.getElementById('root')
)
