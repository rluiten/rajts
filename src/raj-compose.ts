import { Dispatch, Effect } from './raj'

export function mapEffect<TMessageIn, TMessageOut>(
  effect: Effect<TMessageIn> | undefined,
  map: (message: TMessageIn | undefined) => TMessageOut
) {
  return effect
    ? (dispatch: Dispatch<TMessageOut>) =>
        effect(message => dispatch(map(message)))
    : undefined
}

export function batchEffects<TMessage>(
  effects: Array<Effect<TMessage> | undefined>
) {
  return (dispatch: Dispatch<TMessage>) =>
    effects.map(effect => (effect ? effect(dispatch) : undefined))
}
