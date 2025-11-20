const { log } = require("../../src/utils/logger");

describe("Logger Utility", () => {
  it("should be a function", () => {
    expect(typeof log).toBe("function");
  });

  it("should log a message without throwing an error", () => {
    expect(() => {
      log("Test message");
    }).not.toThrow();
  });

  it("should accept any string message", () => {
    expect(() => {
      log("Another test message");
    }).not.toThrow();
  });
});
