// changes from raj-react
// 1. Added types
// 2. Component not a parameter just access React, not sure if bad consequence.

import * as React from 'react'
import { IProgram, runtime } from './raj'

export function program<TProps, TState, TMessage>(
  createApp: (props: TProps) => IProgram<TState, TMessage>
) {
  interface IWrapperState {
    state: TState | undefined
  }

  return class RajProgram extends React.Component<TProps, IWrapperState> {
    private _view: any
    private _killProgram: any
    private _dispatch: any

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
      return this._view ? this._view(this.state.state, this._dispatch) : null
    }
  }
}
