export const check = (n: number) => {
  const user = { name: 'Ann', age: n }
  user.age = n * 2

  const parse = Number.parseInt
  const cache = new Map([[n, user]])
  const missing = cache.get(n + 1)

  setTimeout(() => {
    user.name = 'Bob'
  }, 500)

  if (n > 5) {
    return BigInt(n)
  }
  return { user, parse, missing }
}
