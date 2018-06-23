/**
 * Differences from raj 1.0.0.
 *
 * The result of update is now object of { state, effect } not an array to make
 * type mapping a bit simpler.
 * The types mean the minimum form of a program is a bit larger than javascript
 * see test "runtime() minimal program state for an example.
 *
 * Considering if algebraic type for result of update() is worth it.
 *
 * Formatting with prettier semi: false, singleQuote: true.
 */

/**
 * Dispatch function to send messages
 */
export type Dispatch<TMessage> = (message?: TMessage) => void

export type Effect<TMessage> = (dispatch: Dispatch<TMessage>) => void

/**
 * The result of update next state and maybe effect,
 * TODO use maybe ?
 */
export interface INext<TState, TMessage> {
  state: TState
  effect?: Effect<TMessage>
}

export interface IProgram<TState, TMessage> {
  init: INext<TState, TMessage>
  update: (message: TMessage, state: TState) => INext<TState, TMessage>
  view: (state: TState, dispatch: Dispatch<TMessage>) => void
  done?: (state: TState) => void
}

export function runtime<TState, TMessage>({
  init,
  done,
  update,
  view
}: IProgram<TState, TMessage>) {
  let state: TState
  let isRunning = true

  function dispatch(message: TMessage) {
    if (isRunning) {
      change(update(message, state))
    }
  }

  function change(result: INext<TState, TMessage>) {
    state = result.state
    const effect = result.effect
    if (effect) {
      effect(dispatch)
    }
    view(state, dispatch)
  }

  change(init)

  return function end() {
    if (isRunning) {
      isRunning = false
      if (done) {
        done(state)
      }
    }
  }
}

//
// hmm do i want to use a class definition ? Hmm.

// build Algebraic Data Type for state effect model.
// will make lib code bigger, and calling code bigger?
interface IState<TState> {
  kind: 'state'
  state: TState
}

interface IStateEffect<TState> {
  kind: 'stateEffect'
  state: TState
  effect: () => void
}

type Next<TState> = IState<TState> | IStateEffect<TState>

// helpers for lib consumers ?
export function justState<TState>(state: TState): Next<TState> {
  return { kind: 'state', state }
}

// helpers for lib consumers ?
export function stateEffect<TState>(
  state: TState,
  effect: () => void
): Next<TState> {
  return { kind: 'stateEffect', state, effect }
}
