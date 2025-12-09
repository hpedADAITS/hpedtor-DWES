const request = require("supertest");
const express = require("express");
const JWT = require("../../src/utils/jwt");
const acceso = require("../../src/routes/access");
const errorHandler = require("../../src/utils/errorHandler");

const app = express();
app.use(express.json());
app.use("/api/v1/access", acceso);
app.use((req, res) => res.status(404).json({ error: "not_found" }));
app.use(errorHandler);

describe("Access Routes", () => {
  describe("GET /api/v1/access/public", () => {
    it("permite acceso sin token", async () => {
      const res = await request(app).get("/api/v1/access/public");
      expect(res.status).toBe(200);
      expect(res.body.data.access).toBe("open");
    });

    it("no requiere token", async () => {
      const res = await request(app).get("/api/v1/access/public");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/v1/access/token", () => {
    it("genera token", async () => {
      const res = await request(app).post("/api/v1/access/token");
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it("retorna token válido", async () => {
      const res = await request(app).post("/api/v1/access/token");
      const token = res.body.data.token;
      const payload = JWT.verify(token);
      expect(payload).toBeDefined();
      expect(payload.userId).toBeDefined();
    });

    it("token contiene rol user", async () => {
      const res = await request(app).post("/api/v1/access/token");
      const token = res.body.data.token;
      const payload = JWT.verify(token);
      expect(payload.rol).toBe("user");
    });
  });

  describe("GET /api/v1/access/vip", () => {
    it("rechaza sin token", async () => {
      const res = await request(app).get("/api/v1/access/vip");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("unauthorized");
    });

    it("rechaza token inválido", async () => {
      const res = await request(app)
        .get("/api/v1/access/vip")
        .set("Authorization", "Bearer invalid");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("unauthorized");
    });

    it("permite token válido", async () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      const res = await request(app)
        .get("/api/v1/access/vip")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.access).toBe("vip");
    });
  });

  describe("GET /api/v1/access/admin", () => {
    it("rechaza sin token", async () => {
      const res = await request(app).get("/api/v1/access/admin");
      expect(res.status).toBe(401);
    });

    it("rechaza token inválido", async () => {
      const res = await request(app)
        .get("/api/v1/access/admin")
        .set("Authorization", "Bearer invalid");
      expect(res.status).toBe(401);
    });

    it("rechaza token sin rol admin", async () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      const res = await request(app)
        .get("/api/v1/access/admin")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    it("rechaza si rol no es user", async () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      const res = await request(app)
        .get("/api/v1/access/admin")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    it("permite token válido con rol admin", async () => {
      const payload = { userId: "admin-123", rol: "admin" };
      const token = JWT.generate(payload);
      const res = await request(app)
        .get("/api/v1/access/admin")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.access).toBe("admin");
    });
  });
});
