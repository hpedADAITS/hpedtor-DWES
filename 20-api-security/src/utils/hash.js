const bcrypt = require("bcrypt");

class HashSvc {
  static async hashPassword(contraseña) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(contraseña, salt);
  }

  static async comparePassword(contraseña, hash) {
    return bcrypt.compare(contraseña, hash);
  }
}

module.exports = HashSvc;
