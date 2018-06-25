import * as React from 'react'
import counter, {
  IMessage as ICounterMessage,
  IState as ICounterState
} from './counter'
import { Dispatch, Effect, INext, IProgram } from './raj'
import { batchEffects, mapEffect } from './raj-compose'
import { ReactView } from './raj-react'

/**
 * Nest counters inside our control
 * Have 2 counters and make second counter control
 * how many extra counters are added.
 */

/**
 * State
 */
export interface IState {
  counter1: ICounterState
  counter2: ICounterState
  counters: ICounterState[]
}

// Algebraic Data Type for messages
interface ICounter1 {
  kind: 'counterMessage1'
  data: ICounterMessage
}

interface ICounter2 {
  kind: 'counterMessage2'
  data: ICounterMessage
}

// TODO remove counter 'x' rather than an adjust ?  means add render to each for local message ?
// using value of counter its state ? decide if counters go up / down ? ick.
interface IAdjustCountersCount {
  kind: 'adjustCounters'
  // target number of counters to have
  count: number
}

interface ICountersMessage {
  kind: 'countersMessage'
  data: ICounterMessage
  index: number
}

export type IMessage =
  | ICounter1
  | ICounter2
  | IAdjustCountersCount
  | ICountersMessage

const counterMessage1 = (message: ICounterMessage): IMessage => ({
  data: message,
  kind: 'counterMessage1'
})

const counterMessage2 = (message: ICounterMessage): IMessage => ({
  data: message,
  kind: 'counterMessage2'
})

const countersMessage = (index: number) => (
  message: ICounterMessage
): IMessage => ({
  data: message,
  index,
  kind: 'countersMessage'
})

const counterInit = counter.init

// when increment counterMessage2, fire default and 'adjustCounters'
function doNormalEffectAndAddCounter({
  state,
  effect
}: INext<ICounterState, ICounterMessage>): Effect<IMessage> {
  return (dispatch: Dispatch<IMessage>) => {
    const newEffect = mapEffect(effect, counterMessage2)
    if (newEffect) {
      newEffect(dispatch)
    }
    if (state >= 0) {
      dispatch({ count: state, kind: 'adjustCounters' })
    }
  }
}

const counterNest: IProgram<IState, IMessage, ReactView> = {
  init: {
    effect: batchEffects([
      // init state of counters is empty at the moment so not here
      mapEffect(counterInit.effect, counterMessage1),
      mapEffect(counterInit.effect, counterMessage2)
    ]),
    state: {
      counter1: counterInit.state,
      counter2: counterInit.state,
      counters: []
    }
  },
  update(message, state) {
    if (message.kind === 'counterMessage1') {
      const result = counter.update(message.data, state.counter1)
      return {
        effect: mapEffect(result.effect, counterMessage1),
        state: { ...state, counter1: result.state }
      }
    }
    if (message.kind === 'counterMessage2') {
      const result = counter.update(message.data, state.counter2)
      return {
        effect: doNormalEffectAndAddCounter(result),
        state: { ...state, counter2: result.state }
      }
    }
    if (message.kind === 'adjustCounters') {
      if (message.count === state.counters.length) {
        return { state }
      }
      // updating immutable style, not sure that matters for raj, but may assist React long term
      const addCount = message.count - state.counters.length
      const newCounters =
        addCount < 0
          ? state.counters.slice(0, message.count)
          : [...state.counters, ...Array(addCount).fill(counterInit.state)]
      return {
        state: { ...state, counters: newCounters }
      }
    }
    if (message.kind === 'countersMessage') {
      const result = counter.update(message.data, state.counters[message.index])
      state.counters[message.index] = result.state // TODO remove state mutate ?
      return {
        effect: mapEffect(result.effect, countersMessage(message.index)),
        state: { ...state, counters: state.counters }
      }
    }
    return { state }
  },
  view(state, dispatch) {
    return (
      <div>
        <p>This is the counterNest2 program.</p>
        <p>First counter is a counter.</p>
        {counter.view(state.counter1, message =>
          dispatch(counterMessage1(message))
        )}
        <p>Second counter is a count of counters.</p>
        {counter.view(state.counter2, message =>
          dispatch(counterMessage2(message))
        )}
        <p>The list of counters.</p>
        {state.counters.map((counterState, index) => (
          <div key={index}>
            <table>
              <tbody>
                <tr>
                  <td>Index {index} </td>
                  <td>
                    {counter.view(counterState, message =>
                      dispatch(countersMessage(index)(message))
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }
}

export default counterNest
