export function fizzBuzz(n) {
  if (typeof n !== 'number') {
    throw new TypeError('Parameter must be a number');
  }
  if (n < 1) {
    throw new RangeError('Parameter must be greater than 0');
  }

  if (n % 15 === 0) {
    return 'fizzbuzz';
  }
  if (n % 3 === 0) {
    return 'fizz';
  }
  if (n % 5 === 0) {
    return 'buzz';
  }
  return n;
}
