import { runtime } from './raj'

test('runtime() should call view() initially', asyncDone => {
  const initialState = { a: 'zebra' }

  //   return new Promise(resolve => {
  runtime({
    init: { state: initialState },
    update: (_message, state) => ({ state }),
    view: state => {
      expect(state).toBe(initialState)
      asyncDone()
      // resolve()
    }
  })
  // })
})

test('runtime() should call view() after dispatch', asyncDone => {
  let viewCount = 0

  return new Promise(resolve => {
    runtime({
      init: { state: 'init' },
      // Need to declare type of message in update only
      // to have it defined for IProgram structure or compile fails
      update: (message: string, _state) => ({ state: message }),
      view: (state, dispatch) => {
        viewCount++
        if (state === 'init') {
          dispatch('next')
        }
        if (state === 'next') {
          dispatch('done')
        }
        if (state === 'done') {
          resolve()
        }
      }
    })
  }).then(() => {
    expect(viewCount).toEqual(3)
    asyncDone()
  })
})

test('runtime() should call done() when killed', asyncDone => {
  const initialState = 'state'
  // I don't understand what the Promise gains me ?
  //   return new Promise(resolve => {
  const kill = runtime({
    done: state => {
      expect(state).toBe(initialState)
      asyncDone()
      //   resolve()
    },
    init: { state: initialState },
    update: (_message, state) => ({ state }),
    view: () => undefined
  })

  kill()
  //   })
})

test('runtime() should not call update/view if killed', asyncDone => {
  let initialRender = true
  const initialState = 'state'
  // I don't understand what the Promise gains me ?
  // return new Promise(resolve => {
  const kill = runtime({
    init: {
      effect: dispatch =>
        setTimeout(() => {
          dispatch(undefined)
          asyncDone()
        }, 10),
      state: initialState
    },
    update: (_message, state) => {
      asyncDone.fail('update() should not be called')
      return { state }
    },
    view() {
      if (initialRender) {
        initialRender = false
        return
      }

      asyncDone.fail('view() should not be called more than once')
    }
  })

  kill()
  // })
})

test('runtime() should only call done() once', asyncDone => {
  let initialCall = true

  const kill = runtime({
    init: { state: 0 },
    update: (_message, state) => ({ state }),
    view: () => undefined,
    done(state) {
      if (initialCall) {
        initialCall = false
        asyncDone()
        return
      }
      asyncDone.fail('done() should not be called more than once')
    }
  })

  kill()
  kill()
})

test('runtime() minimal program state', asyncDone => {
  runtime({
    init: { state: 0 },
    update: (_message, state) => ({ state }),
    view: () => undefined
  })
  asyncDone()
})

// Check generic on message parameter to dispatch as reflected in updates
// message parameter works as expected.
test('runtime() with contrived update with more types possible', asyncDone => {
  class IFancyParam {
    public count: number
    public message: string
  }
  runtime({
    init: { state: { count: 0, message: '' } },
    update: (message: string | number | IFancyParam | undefined, state) => {
      if (message === 'hello') {
        return { state: { count: 21, message } }
      }
      if (message === 5000) {
        return { state: { count: 21, message: state.message } }
      }
      if (message instanceof IFancyParam) {
        return { state: { count: message.count, message: message.message } }
      }
      return { state: { count: state.count + 1, message: state.message } }
    },
    view: () => undefined
  })
  asyncDone()
})
