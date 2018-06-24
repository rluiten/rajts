import * as React from 'react'
import { IMessage, IState } from './counter'
import { Dispatch } from './raj'

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

export default CounterComponent
