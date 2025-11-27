const request = require("supertest");
const app = require("../../src/loaders/express");
const User = require("../../src/models/User");
const JWT = require("../../src/utils/jwt");

describe("User Controller", () => {
  let validToken;

  beforeEach(() => {
    User.reset();
    validToken = JWT.generateToken({
      userId: "test-user",
      email: "test@example.com",
      role: "admin",
    });
  });

  describe("GET /api/v1/users", () => {
    it("should return all users", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("count");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/users/:userId", () => {
    it("should return a specific user by ID", async () => {
      const res = await request(app)
        .get("/api/v1/users/1")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id", "1");
      expect(res.body.data).toHaveProperty("name");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("role");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .get("/api/v1/users/999")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("code", 404);
      expect(res.body).toHaveProperty("error", "NOT_FOUND");
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /api/v1/users", () => {
    it("should create a new user with valid data", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${validToken}`)
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(newUser.name);
      expect(res.body.data.email).toBe(newUser.email);
      expect(res.body.data.role).toBe(newUser.role);
      expect(res.body.data).toHaveProperty("createdAt");
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteUser = {
        name: "Test User",
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${validToken}`)
        .send(incompleteUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
      expect(res.body).toHaveProperty("error", "BAD_REQUEST");
    });

    it("should return 400 for invalid email", async () => {
      const invalidUser = {
        name: "Test User",
        email: "invalid-email",
        role: "user",
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${validToken}`)
        .send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });

    it("should return 400 for invalid role", async () => {
      const invalidUser = {
        name: "Test User",
        email: "test@example.com",
        role: "superuser",
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${validToken}`)
        .send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });
  });

  describe("PATCH /api/v1/users/:userId", () => {
    it("should update a user partially", async () => {
      const updates = {
        name: "Updated Name",
      };

      const res = await request(app)
        .patch("/api/v1/users/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.name).toBe("Updated Name");
      expect(res.body.data).toHaveProperty("email");
    });

    it("should return 404 for non-existent user", async () => {
      const updates = { name: "Updated Name" };

      const res = await request(app)
        .patch("/api/v1/users/999")
        .set("Authorization", `Bearer ${validToken}`)
        .send(updates);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("code", 404);
    });

    it("should return 400 for empty body", async () => {
      const res = await request(app)
        .patch("/api/v1/users/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });
  });

  describe("PUT /api/v1/users/:userId", () => {
    it("should replace a user completely", async () => {
      const replacement = {
        name: "Completely New Name",
        email: "new@example.com",
        role: "admin",
      };

      const res = await request(app)
        .put("/api/v1/users/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(replacement);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.name).toBe(replacement.name);
      expect(res.body.data.email).toBe(replacement.email);
      expect(res.body.data.role).toBe(replacement.role);
    });

    it("should return 400 for missing required fields on PUT", async () => {
      const incomplete = {
        name: "Test",
      };

      const res = await request(app)
        .put("/api/v1/users/1")
        .set("Authorization", `Bearer ${validToken}`)
        .send(incomplete);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("code", 400);
    });

    it("should return 404 for non-existent user", async () => {
      const replacement = {
        name: "Test",
        email: "test@example.com",
        role: "user",
      };

      const res = await request(app)
        .put("/api/v1/users/999")
        .set("Authorization", `Bearer ${validToken}`)
        .send(replacement);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("code", 404);
    });
  });

  describe("DELETE /api/v1/users/:userId", () => {
    it("should delete a user", async () => {
      const res = await request(app)
        .delete("/api/v1/users/2")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .delete("/api/v1/users/999")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("code", 404);
    });
  });
});
