const JWT = require("../../src/utils/jwt");

describe("JWT", () => {
  describe("generate()", () => {
    it("genera token válido", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token).toMatch(/\./);
    });

    it("genera tokens con estructura válida", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      const parts = token.split(".");
      expect(parts.length).toBe(3);
    });
  });

  describe("verify()", () => {
    it("verifica token válido", () => {
      const payload = { userId: "test", rol: "user" };
      const token = JWT.generate(payload);
      const decoded = JWT.verify(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe("test");
    });

    it("rechaza token inválido", () => {
      const decoded = JWT.verify("invalid-token");
      expect(decoded).toBeNull();
    });

    it("rechaza token vacío", () => {
      const decoded = JWT.verify("");
      expect(decoded).toBeNull();
    });
  });

  describe("ciclo completo", () => {
    it("generate -> verify funcionan juntos", () => {
      const payload = { userId: "admin-123", rol: "admin" };
      const token = JWT.generate(payload);
      const decoded = JWT.verify(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe("admin-123");
      expect(decoded.rol).toBe("admin");
    });
  });
});
