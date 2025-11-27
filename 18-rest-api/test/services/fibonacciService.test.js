const { fibonacci } = require("../../src/services/fibonacciService");

describe("Fibonacci Service", () => {
  it("should return correct result for n=5", () => {
    expect(fibonacci(5)).toBe(5);
  });

  it("should return 0 for n=0", () => {
    expect(fibonacci(0)).toBe(0);
  });

  it("should return 1 for n=1", () => {
    expect(fibonacci(1)).toBe(1);
  });
});
