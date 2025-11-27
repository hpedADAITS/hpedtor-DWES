const User = require("../models/User");

class UserService {
  static getAllUsers() {
    return User.getAll();
  }

  static getUserById(id) {
    const user = User.getById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return user;
  }

  static createUser(userData) {
    return User.create(userData);
  }

  static updateUser(id, userData) {
    const user = User.update(id, userData);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return user;
  }

  static replaceUser(id, userData) {
    const user = User.replace(id, userData);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return user;
  }

  static deleteUser(id) {
    const deleted = User.delete(id);
    if (!deleted) {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
  }
}

module.exports = UserService;
