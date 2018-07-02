/**
 * Some high order programs to trace activity of a raj program.
 */

import { IProgram } from './raj'

/**
 * As per raj-by-example
 */
export function tapProgram<TState, TMessage, TView>(
  program: IProgram<TState, TMessage, TView>,
  onView: (state: TState) => void
) {
  const result: IProgram<TState, TMessage, TView> = {
    ...program,
    view(model, dispatch) {
      onView(model)
      return program.view(model, dispatch)
    }
  }
  return result
}

/**
 * Assist tracing program
 */
export function traceProgram<TState, TMessage, TView>(
  program: IProgram<TState, TMessage, TView>,
  {
    onView,
    beforeUpdate,
    afterUpdate,
    onDone
  }: {
    onView?: (state: TState) => void
    beforeUpdate?: (message: TMessage, state: TState) => void
    afterUpdate?: (message: TMessage, state: TState) => void
    onDone?: (state: TState) => void
  } = {}
) {
  const result: IProgram<TState, TMessage, TView> = {
    ...program,
    update(message, state) {
      if (beforeUpdate) {
        beforeUpdate(message, state)
      }
      const updateResult = program.update(message, state)
      if (afterUpdate) {
        afterUpdate(message, updateResult.state)
      }
      return updateResult
    },
    view(model, dispatch) {
      if (onView) {
        onView(model)
      }
      return program.view(model, dispatch)
    },
    done(state) {
      if (program.done) {
        if (onDone) {
          onDone(state)
        }
        program.done(state)
      }
    }
  }
  return result
}
