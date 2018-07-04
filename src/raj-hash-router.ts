import { IRajRouter } from './raj-spa'

export type IHashRouterMessage = string

// hash-change router as found in from raj doc.
export const router: IRajRouter<IHashRouterMessage> = {
  subscribe() {
    console.log('raj-hash-router subscribe')
    let listener: () => void
    return {
      effect(dispatch) {
        console.log('raj-hash-router effect')
        listener = () => dispatch(window.location.hash)
        window.addEventListener('hashchange', listener)
        // async listener so initialProgram is needed before it happens
        setTimeout(() => listener(), 100) // dispatch initial route
      },
      cancel() {
        console.log('raj-hash-router cancel')
        window.removeEventListener('hashchange', listener)
      }
    }
  }
}

export default router
