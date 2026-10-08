export const values = new Map<number, unknown>()

export const __trace$ = <T>(id: number, value: T) => {
  values.set(id, value)
  return value
}
