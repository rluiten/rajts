import { Dispatch, IProgram, runtime, View } from './raj'

/**
 * TView is present to allow for more general use with different
 * versions of React and possibly Preact which shares API.
 * Reference: https://github.com/andrejewski/raj-react/issues/19
 */
export function program<TProps extends object, TState, TMessage, TView>(
  Component: React.ComponentClass<TProps>,
  createApp: (props: TProps) => IProgram<TState, TMessage, TView>
) {

  return class RajProgram extends Component {
    // React.Component<TProps, IRajReactState> {

    // another way to set state types that cant via Component argument ? bad idea ?
    public state: { state: TState | undefined } 

    private _view: View<TState, TMessage, TView>
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
