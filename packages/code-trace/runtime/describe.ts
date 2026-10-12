const MAX_LENGTH = 32

const truncate = (text: string) => (text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1)}…` : text)

const describeKeys = (value: object) => {
  const keys = Object.keys(value)
  return keys.length ? `{ ${keys.join(', ')} }` : '{}'
}

export const describe = (value: unknown): string => {
  if (typeof value === 'string') return truncate(JSON.stringify(value))
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'function') return `ƒ ${value.name}`
  if (typeof value !== 'object' || value === null) return String(value)
  if (Array.isArray(value)) return `Array(${value.length})`
  if (value instanceof Map || value instanceof Set) return `${value.constructor.name}(${value.size})`
  if (value instanceof Error) return truncate(`${value.name}: ${value.message}`)
  if (Object.getPrototypeOf(value) === Object.prototype) return truncate(describeKeys(value))
  return value.constructor?.name ?? '{…}'
}
