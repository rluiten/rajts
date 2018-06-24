import { Dispatch, Effect } from './raj'

export function mapEffect<TIn, TOut>(
  effect: Effect<TIn> | undefined,
  map: (message: TIn | undefined) => TOut
) {
  return !effect
    ? undefined
    : (dispatch: Dispatch<TOut>) => {
        effect(message => dispatch(map(message)))
      }
}

export function dispatchEffect<TMessageIn, TMessageOut>(
  dispatch: Dispatch<TMessageOut>,
  effect: Effect<TMessageIn> | undefined,
  adapter: (m: TMessageIn) => TMessageOut
) {
  const newEffect = mapEffect(effect, adapter)
  if (newEffect) {
    newEffect(dispatch)
  }
}
