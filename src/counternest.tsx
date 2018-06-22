import * as React from 'react'
import counter, {
  IMessage as ICounterMessage,
  IState as ICounterState
} from './counter'
import { DispatchFunc, INext, IProgram } from './raj'

// init's maybe rename
const initCounterState = counter.init.state
const initCounterEffect = counter.init.effect

interface IState {
  counterState: ICounterState
}

interface IMessage {
  data: ICounterMessage
  type: 'counterMessage' // string
}

const initEffect = initCounterEffect
  ? (dispatch: DispatchFunc<IMessage>) => {
      initCounterEffect(data => {
        dispatch({
          data,
          type: 'counterMessage'
        })
      })
    }
  : undefined

const init: INext<IState, IMessage> = {
  effect: initEffect,
  state: {
    counterState: initCounterState
  }
}

const counternest: IProgram<IState, IMessage> = {
  init,
  update(message, state) {
    if (message.type === 'counterMessage') {
      const result = counter.update(message.data, state.counterState)
      const newState = { counterState: result.state }
      const effect = result.effect
        ? (dispatch: DispatchFunc<IMessage>) => {
            // must check set again inside function
            if (result.effect) {
              result.effect(m1 => {
                dispatch({
                  data: m1,
                  type: 'counterMessage'
                })
              })
            }
          }
        : undefined
      return { state: newState, effect }
    }
    return { state }
  },
  view(state, dispatch) {
    return (
      <div>
        <p>This is the root program.</p>
        {counter.view(state.counterState, message => {
          dispatch({
            data: message,
            type: 'counterMessage'
          })
        })}
      </div>
    )
  }
}

export default counternest
