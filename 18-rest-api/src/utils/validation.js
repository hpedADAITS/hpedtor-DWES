const validateUser = (data, requireAll = true) => {
  const errors = [];

  if (requireAll || data.name !== undefined) {
    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim() === ""
    ) {
      errors.push("name is required and must be a non-empty string");
    }
  }

  if (requireAll || data.email !== undefined) {
    if (!data.email || typeof data.email !== "string") {
      errors.push("email is required and must be a string");
    } else if (!isValidEmail(data.email)) {
      errors.push("email must be a valid email address");
    }
  }

  if (requireAll || data.role !== undefined) {
    if (!data.role || typeof data.role !== "string") {
      errors.push("role is required and must be a string");
    } else if (!["user", "admin"].includes(data.role)) {
      errors.push("role must be either 'user' or 'admin'");
    }
  }

  if (requireAll && Object.keys(data).length === 0) {
    errors.push("Request body cannot be empty");
  }

  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = { validateUser, isValidEmail };
