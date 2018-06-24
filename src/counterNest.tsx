import * as React from 'react'
import counter, {
  IMessage as ICounterMessage,
  initWithCount,
  isCountHigh,
  IState as ICounterState
} from './counter'
import { IProgram } from './raj'
import { mapEffect } from './raj-compose'
import { ReactView } from './raj-react'

export interface IState {
  counter: ICounterState
}

export interface IMessage {
  data: ICounterMessage
  type: 'counterMessage'
}

const counterMessage = (message: ICounterMessage): IMessage => ({
  data: message,
  type: 'counterMessage'
})

const counterInit = initWithCount(98)

const counterNest: IProgram<IState, IMessage, ReactView> = {
  init: {
    effect: mapEffect(counterInit.effect, counterMessage),
    state: { counter: counterInit.state }
  },
  update({ type, data }, state) {
    if (type === 'counterMessage') {
      const result = counter.update(data, state.counter)
      if (isCountHigh(result.state)) {
        console.log('to high')
      }
      return {
        effect: mapEffect(result.effect, counterMessage),
        state: { ...state, counter: result.state }
      }
    }
    return { state }
  },
  view(state, dispatch) {
    return (
      <div>
        <p>This is the counterNest program.</p>
        {counter.view(state.counter, message => {
          dispatch(counterMessage(message))
        })}
      </div>
    )
  }
}

export default counterNest
