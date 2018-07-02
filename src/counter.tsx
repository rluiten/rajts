import * as React from 'react'
import CounterComponent from './CounterComponent'
import { INext, IProgram } from './raj'

export type ReactView = JSX.Element | null

export type IMessage = string

export type IState = number

export function initWithCount(state: IState): INext<IState, IMessage> {
  return {
    effect: _ => console.log('_____ init with'),
    state
  }
}

export function isCountHigh(state: IState) {
  return state > 100
}

export const counter: IProgram<IState, IMessage, ReactView> = {
  init: {
    effect: _ => console.log('_____ init  def'),
    state: 0
  },
  update(message, state) {
    if (message === 'increment') {
      return { state: state + 1 }
    }
    return { state: state - 1 }
  },
  view(state, dispatch) {
    return <CounterComponent {...{ state, dispatch }} />
  }
}

export default counter
