import { runtime } from './raj'

// Type checks without explicit State type declaration. yay!
runtime({
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
})
