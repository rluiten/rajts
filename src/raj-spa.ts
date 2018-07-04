import { Done, Effect, INext, IProgram, Update, View } from './raj'
import { batchEffects, mapEffect } from './raj-compose'

export interface IGetRoute<TMessage> {
  kind: 'GetRoute'
  route: TMessage
}

export interface IGetProgram<TMessage> {
  kind: 'GetProgram'
  data: TMessage
}

export interface IProgramMsg<TMessage> {
  kind: 'ProgramMsg'
  data: TMessage
}

export interface IRajRouter<TMessage> {
  subscribe: () => ISubscribe<TMessage>
}

export interface ISubscribe<TMessage> {
  effect: Effect<TMessage>
  cancel: () => void
}

// For now just assume next state, message can be any
// - what do i lose this way ?
export type GetRouteProgram<TRouterMessage, TView> = (
  router: TRouterMessage
) => IProgram<any, any, TView>

export interface ISpaProps<TState, TProgramMessage, TView, TRouterMessage> {
  router: IRajRouter<TRouterMessage>
  getRouteProgram: GetRouteProgram<TRouterMessage, TView>
  initialProgram: IProgram<TState, TProgramMessage, TView>
  // errorProgram
  // containerView
}

export interface ISpaState<
  TProgramState,
  TProgramMessage,
  TView,
  TRouterMessage
> {
  currentProgram: IProgram<TProgramState, TProgramMessage, TView>
  isTransitioning: boolean
  // programKey: string | undefined
  programState: TProgramState
  routerCancel: () => void
  routerEmitter: Effect<TRouterMessage> | undefined
}

export type ISpaMessage<TProgramMessage, TRouterMessage> =
  | IGetRoute<TRouterMessage>
  | IGetProgram<TProgramMessage>
  | IProgramMsg<TProgramMessage>

export function spa<TProgramState, TProgramMessage, TView, TRouterMessage>({
  router,
  getRouteProgram,
  initialProgram
}: ISpaProps<TProgramState, TProgramMessage, TView, TRouterMessage>) {
  //
  type IState = ISpaState<TProgramState, TProgramMessage, TView, TRouterMessage>
  type IMessage = ISpaMessage<TProgramMessage, TRouterMessage>
  type MapMessage<TIn> = (data: TIn) => IMessage
  const getRoute: MapMessage<TRouterMessage> = route => ({
    kind: 'GetRoute',
    route
  })
  const programMsg: MapMessage<TProgramMessage> = data => ({
    data,
    kind: 'ProgramMsg'
  })
  const getProgram: MapMessage<TProgramMessage> = data => ({
    data,
    kind: 'GetProgram'
  })

  const init = (() => {
    console.log('raj-spa init')
    const { state: initState, effect: initEffect } = initialProgram.init
    const { effect: routerEffect, cancel: routerCancel } = router.subscribe()
    const state: IState = {
      currentProgram: initialProgram,
      isTransitioning: false,
      // programKey: undefined,
      programState: initState,
      routerCancel,
      routerEmitter: undefined
    }
    const effect = batchEffects([
      mapEffect(routerEffect, getRoute),
      mapEffect(initEffect, programMsg)
    ])
    return { state, effect }
  })()

  // TODO what is next state/message being any costing me ?
  function transitionToProgram(
    currentState: IState,
    newProgram: IProgram<any, any, TView>
  ): INext<any, any> {
    console.log('raj-spa transitionToProgram')
    const { state: newProgramState, effect: newProgramEffect } = newProgram.init
    const state = {
      ...currentState,
      currentProgram: newProgram,
      programState: newProgramState
    }
    const subDone = currentState.currentProgram.done
    const effect = batchEffects([
      subDone ? () => subDone(currentState.programState) : undefined,
      mapEffect(newProgramEffect, programMsg)
    ])
    return { state, effect }
  }

  const update: Update<IState, IMessage> = (message, state) => {
    // exhaustive ? never ? or force return type etc.
    console.log('raj-spa update')
    switch (message.kind) {
      case 'GetRoute':
        console.log(message.kind, message.route)
        const nextProgram = getRouteProgram(message.route)
        // todo support keyed programs, need wrapper type for programs or extra field ?
        // todo support getRoutePrograms returning promise, dont think use isPromise though.
        // NOTE dont have programKey or routeEmitter yet.
        console.log(JSON.stringify({ message, nextProgram }))
        return transitionToProgram(state, nextProgram)

      case 'ProgramMsg':
        console.log(message.kind, message.data)
        const {
          state: newSubState,
          effect: newEffect
        } = state.currentProgram.update(message.data, state.programState)
        const newState = { ...state, programModel: newSubState }
        const effect = mapEffect(newEffect, programMsg)
        return { state: newState, effect }
    }
    return { state }
  }

  const view: View<IState, IMessage, TView> = (spaState, dispatch) => {
    const { programState, currentProgram } = spaState
    console.log('raj-spa view state', JSON.stringify(programState))
    return currentProgram.view(programState, x => dispatch(getProgram(x)))
  }

  const done: Done<IState> = state => {
    console.log('raj-spa done')
    const subDone = state.currentProgram.done
    if (subDone) {
      subDone(state.programState)
    }

    if (state.routerCancel) {
      state.routerCancel()
    }
  }

  return { done, init, update, view } as IProgram<IState, IMessage, TView>
}

export default spa
