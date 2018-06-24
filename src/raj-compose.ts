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
