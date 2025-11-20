const request = require("supertest");
const app = require("../../src/app");

describe("Ping Controller", () => {
  it("should respond with pong on GET /api/v1/ping", async () => {
    const response = await request(app).get("/api/v1/ping");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("pong");
  });
});
