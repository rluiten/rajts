import { DispatchFunc, IProgram, runtime } from './raj'

/**
 * Usage example
 * State is a number to count
 */
type State = number

export function effect(dispatch: DispatchFunc<string>) {
  setTimeout(() => dispatch('beep'), 1000)
}

// todo check using Symbol for message type ?
const program: IProgram<State, string> = {
  init: { state: 0 },
  update(_message, state) {
    return { state: state + 1 } // Increment the state
  },
  view(state, dispatch) {
    const keepCounting = window.confirm(`Count is ${state}. Increment?`)
    if (keepCounting) {
      dispatch()
    }
  }
}

console.log({ program })
/* const endProgram =  */ runtime(program)
