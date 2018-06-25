import * as React from 'react'
import counter, {
  IMessage as ICounterMessage,
  IState as ICounterState
} from './counter'
import { arrayAppend, arrayAssign, arrayTruncate } from './immutable'
import { Dispatch, Effect, INext, IProgram } from './raj'
import { batchEffects, mapEffect } from './raj-compose'
import { ReactView } from './raj-react'

/**
 * Nest counters inside our control
 * Have 2 counters and make second counter set number of counters.
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

// Normal counterMessage2 effect
// And 'adjustCounters' affect to modify our counters
function CounterMessage2EffectAndAdjustCounters({
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
      // init state of counters is empty at the moment so no init
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
    // used to improve type checking of typescript (still need 2.9.2)
    let next: INext<IState, IMessage>

    if (message.kind === 'counterMessage1') {
      const result = counter.update(message.data, state.counter1)
      next = {
        effect: mapEffect(result.effect, counterMessage1),
        state: { ...state, counter1: result.state }
      }
    } else if (message.kind === 'counterMessage2') {
      const result = counter.update(message.data, state.counter2)
      next = {
        effect: CounterMessage2EffectAndAdjustCounters(result),
        state: { ...state, counter2: result.state }
      }
    } else if (message.kind === 'adjustCounters') {
      const currentLength = state.counters.length
      if (message.count === currentLength) {
        next = { state }
      } else {
        const initEffects: Array<Effect<IMessage> | undefined> = []
        for (let i = currentLength; i < message.count; ++i) {
          initEffects.push(mapEffect(counterInit.effect, countersMessage(i)))
        }
        const addCount = message.count - currentLength
        const counters =
          addCount < 0
            ? arrayTruncate(state.counters, message.count)
            : arrayAppend(state.counters, counterInit.state, addCount)
        next = {
          effect: batchEffects(initEffects),
          state: { ...state, counters }
        }
      }
    } else if (message.kind === 'countersMessage') {
      const result = counter.update(message.data, state.counters[message.index])
      const counters = arrayAssign(state.counters, message.index, result.state)
      next = {
        effect: mapEffect(result.effect, countersMessage(message.index)),
        state: { ...state, counters }
      }
    } else {
      next = { state }
    }
    return next
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
        {renderCounters(dispatch, state.counters)}
      </div>
    )
  }
}

function renderCounters(
  dispatch: Dispatch<IMessage>,
  counters: ICounterState[]
) {
  return counters.map((counterState, index) => (
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
  ))
}

export default counterNest
