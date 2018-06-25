// immutable update of arrays

export function arrayTruncate<T>(array: T[], count: number) {
  return array.slice(0, count)
}

export function arrayAssign<T>(array: T[], index: number, value: T) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)]
}

export function arrayAppend<T>(array: T[], value: T, count: number = 1) {
  return [...array, ...Array(count).fill(value)]
}

export function arrayRemove<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
