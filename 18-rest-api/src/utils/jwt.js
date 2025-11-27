const crypto = require("crypto");


class JWT {
  static secret = process.env.JWT_SECRET || "your-secret-key-change-in-production";

  static generateToken(payload) {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
      .createHmac("sha256", this.secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64");

    const encodedSignature = this.base64UrlEncode(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  static verifyToken(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const [encodedHeader, encodedPayload, encodedSignature] = parts;

      const signature = crypto
        .createHmac("sha256", this.secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64");

      const encodedExpectedSignature = this.base64UrlEncode(signature);

      if (encodedSignature !== encodedExpectedSignature) return null;

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      return payload;
    } catch (error) {
      return null;
    }
  }

  static base64UrlEncode(str) {
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  static base64UrlDecode(str) {
    str += Array(5 - (str.length % 4)).join("=");
    return Buffer.from(
      str.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString();
  }
}

module.exports = JWT;
