const crypto = require("crypto");

class JWT {
  static secret = process.env.JWT_SECRET || "secret-key";

  static generate(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const hEncoded = this.encode(JSON.stringify(header));
    const pEncoded = this.encode(JSON.stringify(payload));
    const sig = crypto.createHmac("sha256", this.secret).update(`${hEncoded}.${pEncoded}`).digest("base64");
    const sEncoded = this.encode(sig);
    return `${hEncoded}.${pEncoded}.${sEncoded}`;
  }

  static verify(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const [hEncoded, pEncoded, sEncoded] = parts;
      const sig = crypto.createHmac("sha256", this.secret).update(`${hEncoded}.${pEncoded}`).digest("base64");
      const sCheck = this.encode(sig);
      if (sEncoded !== sCheck) return null;
      return JSON.parse(this.decode(pEncoded));
    } catch {
      return null;
    }
  }

  static encode(str) {
    return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  static decode(str) {
    str += Array(5 - (str.length % 4)).join("=");
    return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
  }
}

module.exports = JWT;
