import * as React from 'react'
import { Dispatch, INext, IProgram } from './raj'
import { ReactView } from './raj-react'

export type IMessage = string

export type IState = number

export function initWithCount(state: number): INext<IState, IMessage> {
  return { state }
}

export function isCountHigh(state: number) {
  return state > 100
}

export const counter: IProgram<IState, IMessage, ReactView> = {
  init: { state: 0 },
  update(message, state) {
    if (message === 'increment') {
      return { state: state + 1 }
    }
    return { state: state - 1 }
  },
  view: (state, dispatch) => <CounterComponent {...{ state, dispatch }} />
}

export default counter

interface IProps {
  dispatch: Dispatch<IMessage>
  state: IState
}

class CounterComponent extends React.Component<IProps> {
  public render() {
    const { state } = this.props
    return (
      <div>
        <span>Count is {state}.</span>&nbsp;&nbsp;&nbsp;
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    )
  }

  private increment = () => this.props.dispatch('increment')
  private decrement = () => this.props.dispatch('decrement')
}
