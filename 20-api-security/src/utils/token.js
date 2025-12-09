const crypto = require("crypto");

class TokenSvc {
  static secreto = process.env.TOKEN_SECRET || "secret-key-32-chars-long-for-aes";
  static mensaje = "I know your secret";
  static algo = "aes-256-cbc";

  static gen() {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(this.secreto, "utf8").slice(0, 32);
    const cipher = crypto.createCipheriv(this.algo, key, iv);
    let token = iv.toString("hex");
    token += cipher.update(this.mensaje, "utf8", "hex");
    token += cipher.final("hex");
    return token;
  }

  static verify(token) {
    try {
      const iv = Buffer.from(token.substring(0, 32), "hex");
      const key = Buffer.from(this.secreto, "utf8").slice(0, 32);
      const decipher = crypto.createDecipheriv(this.algo, key, iv);
      let dec = decipher.update(token.substring(32), "hex", "utf8");
      dec += decipher.final("utf8");
      return dec === this.mensaje;
    } catch {
      return false;
    }
  }

  static decrypt(token) {
    try {
      const iv = Buffer.from(token.substring(0, 32), "hex");
      const key = Buffer.from(this.secreto, "utf8").slice(0, 32);
      const decipher = crypto.createDecipheriv(this.algo, key, iv);
      let dec = decipher.update(token.substring(32), "hex", "utf8");
      dec += decipher.final("utf8");
      return dec;
    } catch {
      return null;
    }
  }
}

module.exports = TokenSvc;
