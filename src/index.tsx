import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { program } from './raj-react'

export type ReactView = JSX.Element | null

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

import { beepExample } from './beepExample'
const BeepExample = program<{}, IState, IMessage, ReactView>(
  React.Component,
  _props => beepExample
)
ReactDOM.render(<BeepExample />, document.getElementById('beep-example'))

import counter, { IMessage, IState } from './counter'
const Counter = program<{}, IState, IMessage, ReactView>(
  React.Component,
  _props => counter
)
ReactDOM.render(<Counter />, document.getElementById('counter-example'))

import counterNest, {
  IMessage as ICNMessage,
  IState as ICNState
} from './counterNest'
import { traceProgram } from './raj-trace'
const Nest = program<{}, ICNState, ICNMessage, ReactView>(
  React.Component,
  _props =>
    traceProgram(
      counterNest /* , {
    afterUpdate: (_, s) => console.log({ _out: JSON.stringify(s) })
  } */
    )
)
ReactDOM.render(<Nest />, document.getElementById('nest'))

import counterNest2, {
  IMessage as ICN2Message,
  IState as ICN2State
} from './counterNest2'
const Nest2 = program<{}, ICN2State, ICN2Message, ReactView>(
  React.Component,
  _props =>
    traceProgram(counterNest2, {
      afterUpdate: (_, s) => console.log({ _out: JSON.stringify(s) })
    })
)
ReactDOM.render(<Nest2 />, document.getElementById('nest2'))

import counterNest2Nest, {
  IMessage as ICN2NMessage,
  IState as ICN2NState
} from './counterNest2Nest'
const Nest2Nest = program<{}, ICN2NState, ICN2NMessage, ReactView>(
  React.Component,
  _props => counterNest2Nest
)
ReactDOM.render(<Nest2Nest />, document.getElementById('nest2nest'))

// Consider for Spa, that program state is Any, program message is Any ? // chop down types.
import { IHashRouterMessage } from './raj-hash-router'
import { ISpaMessage, ISpaState, spa } from './raj-spa'
import { INoMessage, INoState, mySpa } from './spa-example'
const MySpa = program<
  {},
  ISpaState<INoState, INoMessage, ReactView, IHashRouterMessage>,
  ISpaMessage<INoMessage, IHashRouterMessage>,
  ReactView
>(React.Component, _props => spa(mySpa))
ReactDOM.render(<MySpa />, document.getElementById('spa-example'))
