import { Dispatch, IProgram, runtime } from './raj'

/**
 * Usage example
 * State is a number to count
 * The dispatch(undefined) is a bit weird be nice to allow ().
 * but can deal with it for now.
 */
type State = number
type Message = string | undefined

export function effect(dispatch: Dispatch<Message>) {
  setTimeout(() => dispatch('beep'), 1000)
}

// todo check using Symbol for message type ?
const program: IProgram<State, Message> = {
  init: { state: 0 },
  update(_message, state) {
    return { state: state + 1 } // Increment the state
  },
  view(state, dispatch) {
    const keepCounting = window.confirm(`Count is ${state}. Increment?`)
    if (keepCounting) {
      dispatch(undefined)
    }
    return null
  }
}

runtime(program)
