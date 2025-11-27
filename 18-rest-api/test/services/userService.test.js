const UserService = require("../../src/services/userService");
const User = require("../../src/models/User");

describe("User Service", () => {
  beforeEach(() => {
    User.reset();
  });
  describe("getAllUsers", () => {
    it("should return an array of users", () => {
      const users = UserService.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it("should return users with required properties", () => {
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

  describe("getUserById", () => {
    it("should return a user by ID", () => {
      const user = UserService.getUserById("1");
      expect(user).toBeDefined();
      expect(user.id).toBe("1");
    });

    it("should throw error for non-existent user", () => {
      expect(() => UserService.getUserById("999")).toThrow();
    });
  });

  describe("createUser", () => {
    it("should create a new user", () => {
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

    it("should create users with unique IDs", () => {
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

  describe("updateUser", () => {
    it("should update a user partially", () => {
      const updates = { name: "Updated Name" };
      const user = UserService.updateUser("1", updates);

      expect(user.id).toBe("1");
      expect(user.name).toBe("Updated Name");
    });

    it("should throw error for non-existent user", () => {
      expect(() => UserService.updateUser("999", { name: "Test" })).toThrow();
    });
  });

  describe("replaceUser", () => {
    it("should replace a user completely", () => {
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

    it("should throw error for non-existent user", () => {
      expect(() =>
        UserService.replaceUser("999", {
          name: "Test",
          email: "test@example.com",
          role: "user",
        }),
      ).toThrow();
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", () => {
      const allUsersBefore = UserService.getAllUsers();
      const countBefore = allUsersBefore.length;

      UserService.deleteUser("3");

      const allUsersAfter = UserService.getAllUsers();
      const countAfter = allUsersAfter.length;

      expect(countAfter).toBe(countBefore - 1);
    });

    it("should throw error for non-existent user", () => {
      expect(() => UserService.deleteUser("999")).toThrow();
    });
  });
});
