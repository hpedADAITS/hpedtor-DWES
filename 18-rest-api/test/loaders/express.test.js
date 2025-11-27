const request = require("supertest");
const app = require("../../src/app");
const JWT = require("../../src/utils/jwt");

describe("Express Loader", () => {
  let validToken;

  beforeEach(() => {
    validToken = JWT.generateToken({
      userId: "test-user",
      email: "test@example.com",
      role: "admin",
    });
  });

  it("should have JSON body parser enabled", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
  });

  it("should return 404 for unknown paths", async () => {
    const response = await request(app).get("/api/v1/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("code", 404);
    expect(response.body).toHaveProperty("error", "NOT_FOUND");
  });
});
