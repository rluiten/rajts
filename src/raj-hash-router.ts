import { IRajRouter } from './raj-spa'

export type IHashRouterMessage = string

// hash-change router as found in from raj doc.
export const router: IRajRouter<IHashRouterMessage> = {
  subscribe() {
    let listener: () => void
    return {
      effect(dispatch) {
        listener = () => dispatch(window.location.hash)
        window.addEventListener('hashchange', listener)
        listener() // dispatch initial route
      },
      cancel() {
        window.removeEventListener('hashchange', listener)
      }
    }
  }
}

export default router
