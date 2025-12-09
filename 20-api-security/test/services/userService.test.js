const UserService = require("../../src/services/userService");
const User = require("../../src/models/User");

describe("Servicio de Usuarios", () => {
  beforeEach(() => {
    User.reset();
  });
  describe("obtenerTodosLosUsuarios", () => {
    it("debe retornar un arreglo de usuarios", () => {
      const users = UserService.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it("debe mostrar usuarios con las propiedades requeridas", () => {
      const users = UserService.getAllUsers();
      users.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("role");
        expect(user).toHaveProperty("createdAt");
      });
    });
  });

  describe("obtenerUsuarioPorId", () => {
    it("debe retornar un usuario por ID", () => {
      const user = UserService.getUserById("1");
      expect(user).toBeDefined();
      expect(user.id).toBe("1");
    });

    it("debe lanzar error para usuario inexistente", () => {
      expect(() => UserService.getUserById("999")).toThrow();
    });
  });

  describe("crearUsuario", () => {
    it("debe crear un nuevo usuario", () => {
      const userData = {
        name: "New User",
        email: "newuser@example.com",
        role: "user",
      };

      const user = UserService.createUser(userData);

      expect(user).toHaveProperty("id");
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user).toHaveProperty("createdAt");
    });

    it("debe crear usuarios con IDs únicos", () => {
      const user1 = UserService.createUser({
        name: "User 1",
        email: "user1@example.com",
        role: "user",
      });

      const user2 = UserService.createUser({
        name: "User 2",
        email: "user2@example.com",
        role: "user",
      });

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("actualizarUsuario", () => {
    it("debe actualizar un usuario parcialmente", () => {
      const updates = { name: "Updated Name" };
      const user = UserService.updateUser("1", updates);

      expect(user.id).toBe("1");
      expect(user.name).toBe("Updated Name");
    });

    it("debe lanzar error para usuario inexistente", () => {
      expect(() => UserService.updateUser("999", { name: "Test" })).toThrow();
    });
  });

  describe("reemplazarUsuario", () => {
    it("debe reemplazar un usuario completamente", () => {
      const replacement = {
        name: "Replaced User",
        email: "replaced@example.com",
        role: "admin",
      };

      const user = UserService.replaceUser("1", replacement);

      expect(user.id).toBe("1");
      expect(user.name).toBe(replacement.name);
      expect(user.email).toBe(replacement.email);
      expect(user.role).toBe(replacement.role);
    });

    it("debe lanzar error para usuario inexistente", () => {
      expect(() =>
        UserService.replaceUser("999", {
          name: "Test",
          email: "test@example.com",
          role: "user",
        }),
      ).toThrow();
    });
  });

  describe("eliminarUsuario", () => {
    it("debe eliminar un usuario", () => {
      const allUsersBefore = UserService.getAllUsers();
      const countBefore = allUsersBefore.length;

      UserService.deleteUser("3");

      const allUsersAfter = UserService.getAllUsers();
      const countAfter = allUsersAfter.length;

      expect(countAfter).toBe(countBefore - 1);
    });

    it("debe lanzar error para usuario inexistente", () => {
      expect(() => UserService.deleteUser("999")).toThrow();
    });
  });
});
