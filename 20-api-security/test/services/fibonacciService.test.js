const { fibonacci } = require("../../src/services/fibonacciService");

describe("Servicio Fibonacci", () => {
  it("debe retornar el resultado correcto para n=5", () => {
    expect(fibonacci(5)).toBe(5);
  });

  it("debe retornar 0 para n=0", () => {
    expect(fibonacci(0)).toBe(0);
  });

  it("debe retornar 1 para n=1", () => {
    expect(fibonacci(1)).toBe(1);
  });
});
