export function fizzBuzzFlexible(n, conditions = { 3: 'fizz', 5: 'buzz' }) {
  if (typeof n !== 'number') {
    throw new TypeError('Parameter must be a number');
  }
  if (n < 1) {
    throw new RangeError('Parameter must be greater than 0');
  }

  const divisors = Object.keys(conditions)
    .map(Number)
    .sort((a, b) => a - b);

  let result = '';
  for (const divisor of divisors) {
    if (n % divisor === 0) {
      result += conditions[divisor];
    }
  }

  return result || n;
}
