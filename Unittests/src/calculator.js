export class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Parameters must be numbers');
    }
    return a + b;
  }

  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Parameters must be numbers');
    }
    return a - b;
  }

  multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Parameters must be numbers');
    }
    return a * b;
  }

  divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Parameters must be numbers');
    }
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }
}
