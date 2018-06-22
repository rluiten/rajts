import * as React from 'react'
import { IProgram } from './raj'

export type IMessage = void

export type IState = number

export const counter: IProgram<IState, IMessage> = {
  init: { state: 0 },
  update(message, state) {
    return { state: state + 1 }
  },
  view: (state, dispatch) => (
    <div>
      <p>Count is {state}.</p>
      <button onClick={() => dispatch()}>Increment</button>
    </div>
  )
}

export default counter
