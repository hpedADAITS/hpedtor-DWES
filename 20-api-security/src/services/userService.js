const User = require("../models/User");

class UserSvc {
  static getAll() {
    return User.getAll();
  }

  static getById(id) {
    const user = User.getById(id);
    if (!user) {
      const error = new Error("No se encuentra el usuario");
      error.statusCode = 404;
      error.code = "not_found";
      throw error;
    }
    return user;
  }

  static create(data) {
    return User.create(data);
  }

  static update(id, data) {
    const user = User.update(id, data);
    if (!user) {
      const error = new Error("No se encuentra el usuario");
      error.statusCode = 404;
      error.code = "not_found";
      throw error;
    }
    return user;
  }

  static replace(id, data) {
    const user = User.replace(id, data);
    if (!user) {
      const error = new Error("No se encuentra el usuario");
      error.statusCode = 404;
      error.code = "not_found";
      throw error;
    }
    return user;
  }

  static delete(id) {
    const ok = User.delete(id);
    if (!ok) {
      const error = new Error("No se encuentra el usuario");
      error.statusCode = 404;
      error.code = "not_found";
      throw error;
    }
  }
}

module.exports = UserSvc;
