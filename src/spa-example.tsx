import * as React from 'react'
import { IProgram } from './raj'
import router, { IHashRouterMessage } from './raj-hash-router'
import { GetRouteProgram, ISpaProps } from './raj-spa'

export type ReactView = JSX.Element | null
export type INoState = number
export type INoMessage = string | undefined
type ViewProgram = IProgram<any, any, ReactView>

function viewProgram(n: number, view: ReactView): ViewProgram {
  return {
    init: { state: n },
    update: (_message: any, state: any) => ({ state }),
    view: (_state, _dispatch) => view
  }
}

const Menu: React.SFC<{}> = props => (
  <div>
    <div className="nav-menu">
      <a href="#users/">Go to Users</a>
      <a href="#home/">Go to Home</a>
      <a href="#">Go to Root</a>
    </div>
    {props.children}
  </div>
)

const pageNotFound = viewProgram(1, <Menu>Page Not Found</Menu>)
const homeProgram = viewProgram(2, <Menu>Home Page Content</Menu>)
const initialProgram = viewProgram(3, <Menu>Initial Program Content</Menu>)

type IUserState = number
type IUserMessage = string | undefined
const userProgram: IProgram<IUserState, IUserMessage, ReactView> = {
  init: { state: 4 },
  update: (_message, state) => ({ state }),
  view: (_state, _dispatch) => <Menu>User Program Content</Menu>
}

const getRouteProgram: GetRouteProgram<
  IHashRouterMessage,
  ReactView
> = route => {
  console.log('getRouteProgram', route)
  if (route === '#home/') {
    return homeProgram
  }

  if (route.startsWith('#users/')) {
    console.log('i am in users')
    return userProgram
  }

  return pageNotFound
}

export const mySpa: ISpaProps<
  INoState,
  INoMessage,
  ReactView,
  IHashRouterMessage
> = {
  getRouteProgram,
  initialProgram,
  router
}
