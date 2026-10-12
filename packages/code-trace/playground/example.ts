export const check = (n: number) => {
  const user = { name: 'Ann', age: n }
  const tags = new Set(['a', 'b'])
  const parse = Number.parseInt
  const level = n < 0 ? 'negative' : n === 0 ? 'zero' : n < 10 ? 'small' : 'large'

  let sum = 0
  for (let i = 0; i < n; i++) sum += i
  while (sum > 10) sum -= 10
  do sum++
  while (sum < 3)

  switch (n % 2) {
    case 0:
      user.age = n * 2
      break
    default:
      user.name = 'Bob'
  }

  const found = [n, sum].find((x) => x > 100)

  setTimeout(() => {
    user.name = 'Late'
  }, 500)

  if (n > 1000) throw new Error('too big')
  if (n > 5) return BigInt(Math.round(n))
  return { user, tags, parse, level, found }
}
