const request = require("supertest");
const app = require("../../src/loaders/express");
const JWT = require("../../src/utils/jwt");

describe("Authentication Routes", () => {
  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data.user.role).toBe("admin");
    });

    it("should fail with invalid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("code", 401);
      expect(res.body).toHaveProperty("error", "UNAUTHORIZED");
    });

    it("should fail without email", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });

    it("should fail without password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });
  });

  describe("JWT Token", () => {
    it("should generate valid JWT token", () => {
      const payload = {
        userId: "123",
        email: "test@example.com",
        role: "user",
      };

      const token = JWT.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });

    it("should verify valid token", () => {
      const payload = {
        userId: "123",
        email: "test@example.com",
        role: "user",
      };

      const token = JWT.generateToken(payload);
      const decoded = JWT.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it("should reject invalid token", () => {
      const invalidToken = "invalid.token.format";
      const decoded = JWT.verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it("should reject modified token", () => {
      const payload = {
        userId: "123",
        email: "test@example.com",
        role: "user",
      };

      const token = JWT.generateToken(payload);
      const modifiedToken = token.replace(/.$/, "x");
      const decoded = JWT.verifyToken(modifiedToken);

      expect(decoded).toBeNull();
    });
  });
});
