const validate = (data, requireAll = true) => {
  const errors = [];

  if (requireAll || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      errors.push("name required");
    }
  }

  if (requireAll || data.email !== undefined) {
    if (!data.email || typeof data.email !== "string") {
      errors.push("email required");
    } else if (!isEmail(data.email)) {
      errors.push("invalid email format");
    }
  }

  if (requireAll || data.role !== undefined) {
    if (!data.role || typeof data.role !== "string") {
      errors.push("role required");
    } else if (!["user", "admin"].includes(data.role)) {
      errors.push("role must be user or admin");
    }
  }

  return errors;
};

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports = { validate, isEmail };
