import * as React from 'react'
import counterNest, {
  IMessage as ICN2Message,
  IState as ICN2State
} from './counterNest2'
import { Dispatch, IProgram } from './raj'
import { dispatchEffect, mapEffect } from './raj-compose'
import { ReactView } from './raj-react'

export interface IState {
  counter1: ICN2State
  counter2: ICN2State
}

export interface IMessage {
  kind: 'counter1' | 'counter2'
  data: ICN2Message
}

type MessageAdapter = (m: ICN2Message) => IMessage

const counter1: MessageAdapter = data => ({ data, kind: 'counter1' })
const counter2: MessageAdapter = data => ({ data, kind: 'counter2' })

const init = counterNest.init

const styleBox = {
  border: '1px black solid',
  margin: '8px',
  padding: '8px'
}

const counterNest2Nest: IProgram<IState, IMessage, ReactView> = {
  init: {
    effect: (dispatch: Dispatch<IMessage>) => {
      dispatchEffect(dispatch, init.effect, counter1)
      dispatchEffect(dispatch, init.effect, counter2)
    },
    state: {
      counter1: init.state,
      counter2: init.state
    }
  },
  update(message, state) {
    if (message.kind === 'counter1') {
      const result = counterNest.update(message.data, state.counter1)
      return {
        effect: mapEffect(result.effect, counter1),
        state: { ...state, counter1: result.state }
      }
    }
    if (message.kind === 'counter2') {
      const result = counterNest.update(message.data, state.counter2)
      return {
        effect: mapEffect(result.effect, counter2),
        state: { ...state, counter2: result.state }
      }
    }
    return { state }
  },
  view(state, dispatch) {
    return (
      <div>
        <p>This is the counterNest2Nest program.</p>
        <div style={styleBox}>
          <p>First nestCounter2 is a counter.</p>
          {counterNest.view(state.counter1, message =>
            dispatch(counter1(message))
          )}
        </div>
        <div style={styleBox}>
          <p>Second nestCounter2 is a counter.</p>
          {counterNest.view(state.counter2, message =>
            dispatch(counter2(message))
          )}
        </div>
      </div>
    )
  }
}

export default counterNest2Nest
