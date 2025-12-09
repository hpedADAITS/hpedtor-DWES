const JWT = require("../../src/utils/jwt");
const { validarToken, validarAdmin } = require("../../src/middleware/token");

describe("Token Middleware", () => {
  describe("validarToken", () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = {};
      next = jest.fn();
    });

    it("rechaza sin token", () => {
      validarToken(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err.message).toBe("token requerido");
      expect(err.statusCode).toBe(401);
    });

    it("rechaza token inválido", () => {
      req.headers.authorization = "Bearer invalid-token";
      validarToken(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err.message).toBe("token inválido");
    });

    it("acepta token válido", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      req.headers.authorization = `Bearer ${token}`;
      validarToken(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.usuario).toBeDefined();
      expect(req.usuario.userId).toBe("test");
    });

    it("extrae token del header Bearer", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      req.headers.authorization = `Bearer ${token}`;
      validarToken(req, res, next);
      expect(req.usuario.userId).toBe("test");
    });
  });

  describe("validarAdmin", () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = {};
      next = jest.fn();
    });

    it("rechaza sin token", () => {
      validarAdmin(req, res, next);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it("rechaza token inválido", () => {
      req.headers.authorization = "Bearer invalid-token";
      validarAdmin(req, res, next);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it("rechaza sin rol admin", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      req.headers.authorization = `Bearer ${token}`;
      validarAdmin(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err.message).toBe("acceso admin requerido");
      expect(err.statusCode).toBe(403);
    });

    it("acepta token válido con rol admin", () => {
      const payload = { userId: "admin-123", rol: "admin" };
      const token = JWT.generate(payload);
      req.headers.authorization = `Bearer ${token}`;
      validarAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.usuario.rol).toBe("admin");
    });

    it("rechaza si rol no es admin", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      req.headers.authorization = `Bearer ${token}`;
      validarAdmin(req, res, next);
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });
});
