import * as React from 'react'
import { Atom, Lens } from '@grammarly/focal'
import { F, reactiveList } from '@grammarly/focal-react'
import {
  defaultAppState, defaultNodeState,
  AppState, NodeState
} from './model'

const Counter = (props: { value: Atom<number> }) =>
  <div>
    <F.span>Counter {props.value}</F.span>
    <F.input type='submit' value='+' onClick={() => props.value.modify(x => x + 1)} />
    <F.input type='submit' value='-' onClick={() => props.value.modify(x => x - 1)} />
  </div>

const Node = (props: { state: Atom<NodeState>, removeNode?: () => void }): JSX.Element => {
  const children = props.state.lens(x => x.children)
  return (
    <div>
      <Counter value={props.state.lens(x => x.value)} />
      {
        props.removeNode &&
        <F.input
          type='submit'
          value='Remove'
          onClick={() => props.removeNode && props.removeNode()}
        />
      }
      <F.ul>
        {
          reactiveList(
            children.view(x => x.map((_, index) => index)),
            index => (
              <li key={index}>
                <Node
                  state={children
                    .lens(Lens.index<NodeState>(index))
                    .lens(Lens.withDefault(defaultNodeState))
                  }
                  removeNode={() => children.modify(x => x.filter((_, i) => i !== index))}
                />
              </li>
            )
          )
        }
      </F.ul>
      <F.input
        type='submit'
        value='Add child'
        onClick={() => props.state.lens(x => x.children).modify(x => [...x, defaultNodeState])}
      />
    </div>
  )
}

const App = (props: { state: Atom<AppState> }) =>
  <div>
    <Node state={props.state.lens(x => x.tree)} />
  </div>

export default {
  Component: App,
  defaultState: defaultAppState
}
