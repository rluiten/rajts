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

export function batchEffects<TMessage>(
  effects: Array<Effect<TMessage> | undefined>
) {
  return function _batchEffects(dispatch: Dispatch<TMessage>) {
    return effects.map(effect => {
      if (effect) {
        return effect(dispatch)
      }
    })
  }
}
