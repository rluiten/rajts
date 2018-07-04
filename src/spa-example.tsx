import * as React from 'react'
import { IProgram } from './raj'
import router, { IHashRouterMessage } from './raj-hash-router'
import { GetRouteProgram, ISpaProps } from './raj-spa'

export type ReactView = JSX.Element | null
export type INoState = number
export type INoMessage = string | undefined

function displayProgram(
  n: number,
  content: ReactView
): IProgram<any, any, ReactView> {
  return {
    init: { state: n },
    update: (_message: any, state: any) => ({ state }),
    view(_state, _dispatch) {
      return content
    }
  }
}

function Menu() {
  return (
    <>
      <a href="#users/">Go to Users</a> <a href="#home/">Go to Home</a>{' '}
      <a href="#">Go to Root</a>
    </>
  )
}

const pageNotFoundProgram = displayProgram(
  1,
  <div>
    <div>
      <Menu />
    </div>
    Page Not Found
  </div>
)

const homeProgram = displayProgram(
  2,
  <div>
    <div>
      <Menu />
    </div>
    Home Page Content
  </div>
)

const initialProgram = displayProgram(
  3,
  <div>
    Initial Program Content{' '}
    <button
      onClick={() => {
        // tslint:disable-next-line:jsx-no-lambda
        console.log('click button')
      }}
    >
      <div>
        <Menu />
      </div>
      Button Text
    </button>
    <Menu />
  </div>
)

type IUserState = number
type IUserMessage = string | undefined
const userProgram: IProgram<IUserState, IUserMessage, ReactView> = {
  init: { state: 11 },
  update: (_message, state) => ({ state }),
  view(_state, _dispatch) {
    return (
      <div>
        <div>
          <Menu />
        </div>
        User Program Content
      </div>
    )
  }
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

  return pageNotFoundProgram
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
