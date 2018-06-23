import * as React from 'react'
import counter, {
  IMessage as ICounterMessage,
  IState as ICounterState
} from './counter'
import { Dispatch, Effect, INext, IProgram } from './raj'

interface IState {
  counter: ICounterState
}

interface IMessage {
  data: ICounterMessage
  type: 'counterMessage'
}

const counternest: IProgram<IState, IMessage> = {
  init: {
    effect: wrapEffect(counter.init.effect),
    state: { counter: counter.init.state }
  },
  update({ type, data }, state) {
    if (type === 'counterMessage') {
      return wrapNext(counter.update(data, state.counter))
    }
    return { state }
  },
  view(state, dispatch) {
    return (
      <div>
        <p>This is the root program.</p>
        {counter.view(state.counter, data => {
          dispatch({ data, type: 'counterMessage' })
        })}
      </div>
    )
  }
}

function wrapEffect(effect: Effect<ICounterMessage> | undefined) {
  return effect
    ? (dispatch: Dispatch<IMessage>) => {
        effect(data => {
          dispatch({ data, type: 'counterMessage' })
        })
      }
    : undefined
}

function wrapNext({ state, effect }: INext<ICounterState, ICounterMessage>) {
  return { state: { counter: state }, effect: wrapEffect(effect) }
}

export default counternest
