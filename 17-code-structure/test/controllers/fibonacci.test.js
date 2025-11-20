const request = require("supertest");
const app = require("../../src/app");

describe("Fibonacci Controller", () => {
  it("should return correct Fibonacci number for n=5", async () => {
    const response = await request(app).get("/api/v1/fibonacci/calculate/5");
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(5);
  });

  it("should return error for invalid input", async () => {
    const response = await request(app).get("/api/v1/fibonacci/calculate/-1");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid input");
  });
});
