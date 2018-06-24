import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { program } from './raj-react'

/* Original Create React App stuff
// import App from './App';
// import './index.css';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
*/

import { beepExample  } from './beepExample'
const BeepExample = program<{}, IState, IMessage>(props => beepExample)
ReactDOM.render(<BeepExample />, document.getElementById('beep-example'))

import counter, { IMessage, IState } from './counter'
const Counter = program<{}, IState, IMessage>(props => counter)
ReactDOM.render(<Counter />, document.getElementById('counter-example'))

import counterNest, {
  IMessage as ICNMessage,
  IState as ICNState
} from './counterNest'
const CounterNest = program<{}, ICNState, ICNMessage>(props => counterNest)
ReactDOM.render(<CounterNest />, document.getElementById('counter-nest'))

import counterNest2, {
  IMessage as ICN2Message,
  IState as ICN2State
} from './counterNest2'
const CounterNest2 = program<{}, ICN2State, ICN2Message>(props => counterNest2)
ReactDOM.render(<CounterNest2 />, document.getElementById('counter-nest2'))
