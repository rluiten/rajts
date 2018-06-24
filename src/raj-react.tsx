//
// Changes from raj-react
// 1. Added types
// 2. Component not a parameter just access React.Component
//

import * as React from 'react'
import { Dispatch, IProgram, runtime, View } from './raj'

/**
 * Use this when creating raj programs using raj-react.
 */
export type ReactView = JSX.Element | null

export function program<TProps, TState, TMessage>(
  createApp: (props: TProps) => IProgram<TState, TMessage, ReactView>
) {
  interface IRajReactState {
    state: TState | undefined
  }

  return class RajProgram extends React.Component<TProps, IRajReactState> {
    private _view: View<TState, TMessage, ReactView>
    private _killProgram: (() => void) | undefined
    private _dispatch: Dispatch<TMessage>

    constructor(props: any, ctx: any) {
      super(props, ctx)
      this.state = { state: undefined }
    }

    public componentDidMount() {
      const app = createApp(this.props)
      this._view = app.view
      this._killProgram = runtime({
        ...app,
        view: (state, dispatch) => {
          this._dispatch = dispatch
          this.setState(() => ({ state }))
          return null
        }
      })
    }

    public componentWillUnmount() {
      if (this._killProgram) {
        this._killProgram()
        this._killProgram = undefined
      }
    }

    public render() {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.REACT_APP_TRACE_RAJ_REACT_RENDER_STATE === 'yes') {
          console.log('raj-react render state', JSON.stringify(this.state))
        }
      }
      // State may not be set yet on first render() call so check state set,
      // typescript raises the risk so just check it.
      // It appears by the time _view is set so is state.
      return this._view
        ? this.state.state !== undefined
          ? this._view(this.state.state, this._dispatch)
          : null
        : null
    }
  }
}
