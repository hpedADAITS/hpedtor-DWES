const UserService = require("../services/userService");
const { validateUser } = require("../utils/validation");
const { logger } = require("../utils");

const getAllUsers = (req, res, next) => {
  try {
    let users = UserService.getAllUsers();

    const { role, search } = req.query;
    if (role) {
      users = users.filter((u) => u.role === role);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower),
      );
    }

    const { sort } = req.query;
    if (sort) {
      const [field, order] = sort.split(":");
      const ascending = order !== "desc";
      users.sort((a, b) => {
        if (a[field] < b[field]) return ascending ? -1 : 1;
        if (a[field] > b[field]) return ascending ? 1 : -1;
        return 0;
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);

    logger.info(
      `Retrieved users: filter=${JSON.stringify({ role, search })}, sort=${sort}, page=${page}, limit=${limit}`,
    );

    res.status(200).json({
      data: paginatedUsers,
      count: paginatedUsers.length,
      total: users.length,
      page,
      limit,
      pages: Math.ceil(users.length / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = UserService.getUserById(userId);
    logger.info(`Retrieved user ${userId}`);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const errors = validateUser({ name, email, role }, true);
    if (errors.length > 0) {
      const error = new Error("Validation Error");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      error.details = errors;
      return next(error);
    }

    const user = UserService.createUser({ name, email, role });
    logger.info(`Created user with ID ${user.id}`);
    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      const error = new Error("Request body cannot be empty");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      return next(error);
    }

    const errors = validateUser(updates, false);
    if (errors.length > 0) {
      const error = new Error("Validation Error");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      error.details = errors;
      return next(error);
    }

    const user = UserService.updateUser(userId, updates);
    logger.info(`Updated user ${userId}`);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const replaceUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    const errors = validateUser({ name, email, role }, true);
    if (errors.length > 0) {
      const error = new Error("Validation Error");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      error.details = errors;
      return next(error);
    }

    const user = UserService.replaceUser(userId, { name, email, role });
    logger.info(`Replaced user ${userId}`);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    UserService.deleteUser(userId);
    logger.info(`Deleted user ${userId}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  replaceUser,
  deleteUser,
};
