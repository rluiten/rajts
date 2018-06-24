## Typescript implementation of RAJ https://github.com/andrejewski/raj

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Raj has been implemented in typescript as an exercise in understanding and exploration.

- raj as `raj.ts`
- raj tests in `raj.spec.ts` using jest
  - Wasn't sure needed the Promise in some tests so commented out.
- raj-react as `raj-react.ts`
- raj-compose as `raj-react.ts` but only mapEffect()

## Index.tsx

Demonstrates raj with 4 components with React.

## Differences from Raj 1.0.0

Some changes to raj structure were introduced moving to typescript

- The original array of [state, effect] was converted to an object to ease typing.
- Removed jsx inline lambda's in counter example by using a helper component
  - Default create react app typescript errors on inline lambda's.
- The types mean the minimum form of a program is a bit larger than javascript
  - see `raj.spec.ts` test "runtime() minimal program state" for an example.
- raj-react Component not a parameter just accesses React.Component directly.

There is an though experiment in moving to use an algebraic data type in raj instead
of the nullable effect in the INext interface.

Usage of raj in typescript

- useraj.ts
- useraj2.ts
- beepExample.tsx
- counter.tsx
  - CounterComponent.tsx
- counterNest.tsx
- counterNest2.tsx
- counterNest2Nest.tsx
  - This one shows 3 layers of raj program.
  - counterNest2Nest -> counterNest2 -> counter

Most of the original create react app with typescript has not been removed.

## Development Environment variables

If in NODE_ENV === 'development' then.

- CREATE_REACT_APP_TRACE_DISPATCH "yes"
  - raj dispatch() console.log JSON.stringify(message)
- REACT_APP_TRACE_RAJ_REACT_RENDER_STATE "yes"
  - raj-react render() console.log JSON.stringify(this.state)
