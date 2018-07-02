import { Done, Effect, INext, IProgram, Update, View } from './raj'
import { batchEffects, mapEffect } from './raj-compose'
// import { mapEffect } from './raj-compose'

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

export interface IProps<TState, TProgramMessage, TView, TRouterMessage> {
  router: IRajRouter<TRouterMessage>
  // For now just assume next state, message can be any
  // - what do i lose this way ?
  getRouteProgram: (route: TRouterMessage) => IProgram<any, any, TView>
  initialProgram: IProgram<TState, TProgramMessage, TView>
  // errorProgram
  // containerView
}

export function spa<TProgramState, TProgramMessage, TView, TRouterMessage>({
  router,
  getRouteProgram,
  initialProgram
}: IProps<TProgramState, TProgramMessage, TView, TRouterMessage>) {
  //
  interface ISpaState {
    currentProgram: IProgram<TProgramState, TProgramMessage, TView>
    isTransitioning: boolean
    // programKey: string | undefined
    programState: TProgramState
    routerCancel: () => void
    routerEmitter: Effect<TRouterMessage> | undefined
  }
  type ISpaMessage =
    | IGetRoute<TRouterMessage>
    | IGetProgram<TProgramMessage>
    | IProgramMsg<TProgramMessage>
  type MapMessage<TIn> = (data: TIn) => ISpaMessage
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
    const { state: initState, effect: initEffect } = initialProgram.init
    const { effect: routerEffect, cancel: routerCancel } = router.subscribe()
    const state: ISpaState = {
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
    currentState: ISpaState,
    newProgram: IProgram<any, any, TView>
  ): INext<any, any> {
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

  const update: Update<ISpaState, ISpaMessage> = (message, state) => {
    // exhaustive ? never ? or force return type etc.
    switch (message.kind) {
      case 'GetRoute':
        console.log(message.kind, message.route)
        const nextProgram = getRouteProgram(message.route)
        // todo support keyed programs, need wrapper type for programs or extra field ?
        // todo support getRoutePrograms returning promise, dont think use isPromise though.

        // NOTE dont have programKey or routeEmitter yet.
        return transitionToProgram(state, nextProgram)
      // break

      // GetProgram does not get used until Promises are used in GetRoute....
      // case 'GetProgram':
      //   // NOTE dont have isTransitioning so state unchanged.
      //   const a = message.data;
      //   console.log(message.kind, message.data)
      //   break

      case 'ProgramMsg':
        console.log(message.kind, message.data)
        const {
          state: newSubState,
          effect: newEffect
        } = state.currentProgram.update(message.data, state.programState)
        const newState = { ...state, programModel: newSubState }
        const effect = mapEffect(newEffect, programMsg)
        return { state: newState, effect }
      // break
    }
    // if (message.kind === 'GetRoute') {

    // }
    return { state }
  }

  const view: View<ISpaState, ISpaMessage, TView> = (spaState, dispatch) => {
    const { programState } = spaState
    return initialProgram.view(programState, x => dispatch(getProgram(x)))
  }

  const done: Done<ISpaState> = state => {
    console.log('done called')
    const subDone = state.currentProgram.done
    if (subDone) {
      subDone(state.programState)
    }

    if (state.routerCancel) {
      state.routerCancel()
    }
  }

  return { done, init, update, view } as IProgram<ISpaState, ISpaMessage, TView>
}

export default spa
