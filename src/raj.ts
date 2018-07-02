/**
 * Typescript version of raj https://github.com/andrejewski/raj.
 */
/**
 * Dispatch function to send messages
 */
export type Dispatch<TMessage> = (message: TMessage) => void

export type Effect<TMessage> = (dispatch: Dispatch<TMessage>) => void

/**
 * The result of update next state and maybe effect.
 */
export interface INext<TState, TMessage> {
  state: TState
  effect?: Effect<TMessage>
}

/**
 * You must set TView when working with a specific view library.
 * Example in React TView would be `JSX.Element | null` which is defined as ReactView in raj-react.
 */
export type View<TState, TMessage, TView = void> = (
  state: TState,
  dispatch: Dispatch<TMessage>
) => TView

export type Update<TState, TMessage> = (
  message: TMessage,
  state: TState
) => INext<TState, TMessage>

export type Done<TState> = (state: TState) => void

/**
 * TView generic parameter is for view library independence.
 *
 * You will need to set TView when working with a specific view library.
 * Example in React TView would be `JSX.Element | null` which is defined as ReactView in raj-react.
 */
export interface IProgram<TState, TMessage, TView = void> {
  init: INext<TState, TMessage>
  update: Update<TState, TMessage>
  view: View<TState, TMessage, TView>
  done?: Done<TState>
}

export function runtime<TState, TMessage = void, TView = void>({
  init,
  done,
  update,
  view
}: IProgram<TState, TMessage, TView>) {
  let state: TState
  let isRunning = true

  function dispatch(message: TMessage) {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.REACT_APP_TRACE_DISPATCH === 'yes') {
        console.log('raj dispatch', JSON.stringify(message))
      }
    }
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

/* -- explore idea -
//
// Consider a class definition, instead of object with fields any benefits ?
// maybe benefit is can define local helper methods on class for something like
// this.increment handler stuff.
//
// Consider Algebraic Data Type for state effect model.
// will make lib code bigger, and code more complex I believe at the moment
//
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
*/
