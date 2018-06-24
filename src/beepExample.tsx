import * as React from 'react'
import { Dispatch, IProgram } from './raj'
import { ReactView } from './raj-react'

type IMessage = string
type IState = number

export function beepEverySecond() {
  let intervalId: NodeJS.Timer
  return {
    beepEffect(dispatch: Dispatch<IMessage>) {
      intervalId = setInterval(() => {
        dispatch('beep')
      }, 1000)
    },
    beepCancel() {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }
}

const beeper = beepEverySecond()
const { beepEffect, beepCancel } = beeper

export const beepExample: IProgram<IState, IMessage, ReactView> = {
  done: state => beepCancel(),
  init: { state: 0, effect: beepEffect },
  update(message, state) {
    switch (message) {
      case 'increment':
        return { state: state + 1 }
      case 'decrement':
        return { state: state - 1 }
      case 'reset':
        return { state: 0 }
      case 'beep':
        console.log('beep')
        return { state: -state, effect: beepCancel } // end beeping
    }
    return { state }
  },
  view(state, dispatch) {
    return <Beeper {...{ state, dispatch }} />
  }
}

// Get jsx inline lambda's out of Program by creating helper React Component
interface IBeeperProps {
  dispatch: Dispatch<IMessage>
  state: IState
}

class Beeper extends React.Component<IBeeperProps> {
  public render() {
    console.log('Beeper render()')
    const { state } = this.props
    return (
      <div>
        <p>This is the beep example program.</p>
        <p>Count is {state}.</p>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.beep}>Beep</button>
      </div>
    )
  }

  // this feels a bit messy but fixes the jsx inline lambda's
  private increment = () => this.props.dispatch('increment')
  private decrement = () => this.props.dispatch('decrement')
  private reset = () => this.props.dispatch('reset')
  private beep = () => this.props.dispatch('beep')
}

export default beepExample
