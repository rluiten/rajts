import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import App from './App';
// import './index.css';
// import registerServiceWorker from './registerServiceWorker';

/*
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
*/

// // THIS WORKED - not sure why it stops react from running behind scenes ?
// import { runtime } from './raj'
// runtime({
//   init: { state:  0 },
//   update (message, state) {
//     return { state: state + 1 }
//   },
//   view (state, dispatch) {

//     const keepCounting = window.confirm(`Count is ${state}. Increment?`)
//     if (keepCounting) {
//       dispatch()
//     }
//   }
// })

import { Dispatch /* , IProgram  */ } from './raj'
import { program } from './raj-react'

type Message = string
type State = number

// export function beepEffect(dispatch: DispatchFunc<Message>) {
//   setTimeout(() => dispatch('beep'), 1000)
// }

// export function beepEverySecond(dispatch: DispatchFunc<Message>) {
//   setInterval(() => dispatch('beep'), 1000)
// }

export function beepEverySecond() {
  let intervalId: NodeJS.Timer
  return {
    beepEffect(dispatch: Dispatch<Message>) {
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

const foo = beepEverySecond()
const { beepEffect, beepCancel } = foo
const Program: any = program<{}, State, Message>(props => ({
  done: state => beepCancel(),
  init: { state: 0, effect: beepEffect },
  update(message, state) {
    // return { state: state + message }
    switch (message) {
      case 'increment':
        return { state: state + 1 }
      case 'decrement':
        return { state: state - 1 }
      case 'reset':
        return { state: 0 }
      // case 'beep':
      //   return { state: -state }
      case 'beep':
        console.log('beep')
        return { state: -state, effect: beepCancel } // end beeping
      // return { state: -state, effect: beepEffect }
      default:
        // to satisfy typescript
        return { state }
    }
  },
  view(state, dispatch) {
    return <Beeper {...{ state, dispatch }} />
  }
}))

// Get inline fat arrows out of Program
interface IBeeperProps {
  dispatch: Dispatch<Message>
  state: State
}
class Beeper extends React.Component<IBeeperProps> {
  public render() {
    const { state } = this.props
    return (
      <div>
        <p>Count is {state}.</p>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.beep}>Beep</button>
      </div>
    )
  }

  // return (
  //   <div>
  //     <p>Count is {state}.</p>
  //     <button onClick={() => dispatch('increment')}>Increment</button>
  //     <button onClick={() => dispatch('decrement')}>Decrement</button>
  //     <button onClick={() => dispatch('reset')}>Reset</button>
  //     <button onClick={() => dispatch('beep')}>Beep</button>
  //   </div>
  // )

  // this feels messy but fixes the jsx inline lambda's
  private increment = () => this.props.dispatch('increment')
  private decrement = () => this.props.dispatch('decrement')
  private reset = () => this.props.dispatch('reset')
  private beep = () => this.props.dispatch('beep')
}

ReactDOM.render(<Program />, document.getElementById('root'))

import counter, { IMessage, IState } from './counter'
const Counter = program<{}, IState, IMessage>(props => counter)
ReactDOM.render(<Counter />, document.getElementById('root2'))

import counterNest, {
  IMessage as ICNMessage,
  IState as ICNState
} from './counterNest'
const CounterNest = program<{}, ICNState, ICNMessage>(props => counterNest)
ReactDOM.render(<CounterNest />, document.getElementById('root3'))

import counterNest2, {
  IMessage as ICN2Message,
  IState as ICN2State
} from './counterNest2'
const CounterNest2 = program<{}, ICN2State, ICN2Message>(props => counterNest2)
ReactDOM.render(<CounterNest2 />, document.getElementById('root4'))
