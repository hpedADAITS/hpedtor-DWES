const svc = require("../services/userService");
const { validate } = require("../utils/validation");
const { log } = require("../utils");

const getAll = (req, res, next) => {
  try {
    let users = svc.getAll();

    const { role, search } = req.query;
    if (role) users = users.filter((u) => u.role === role);
    if (search) {
      const lower = search.toLowerCase();
      users = users.filter((u) =>
        u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
      );
    }

    const { sort } = req.query;
    if (sort) {
      const [field, order] = sort.split(":");
      const asc = order !== "desc";
      users.sort((a, b) => {
        if (a[field] < b[field]) return asc ? -1 : 1;
        if (a[field] > b[field]) return asc ? 1 : -1;
        return 0;
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = users.slice(start, end);

    log.info(`users retrieved: ${paged.length}/${users.length}`);
    res.status(200).json({
      data: paged,
      count: paged.length,
      total: users.length,
      page,
      limit,
      pages: Math.ceil(users.length / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const user = svc.getById(req.params.id);
    log.info(`user found: ${req.params.id}`);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const errors = validate({ name, email, role }, true);
    if (errors.length > 0) {
      const err = new Error("validation failed");
      err.statusCode = 400;
      err.code = "bad_request";
      err.details = errors;
      return next(err);
    }
    const user = svc.create({ name, email, role });
    log.info(`user created: ${user.id}`);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      const err = new Error("empty body");
      err.statusCode = 400;
      err.code = "bad_request";
      return next(err);
    }
    const errors = validate(updates, false);
    if (errors.length > 0) {
      const err = new Error("validation failed");
      err.statusCode = 400;
      err.code = "bad_request";
      err.details = errors;
      return next(err);
    }
    const user = svc.update(id, updates);
    log.info(`user updated: ${id}`);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const replace = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const errors = validate({ name, email, role }, true);
    if (errors.length > 0) {
      const err = new Error("validation failed");
      err.statusCode = 400;
      err.code = "bad_request";
      err.details = errors;
      return next(err);
    }
    const user = svc.replace(id, { name, email, role });
    log.info(`user replaced: ${id}`);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const del = (req, res, next) => {
  try {
    svc.delete(req.params.id);
    log.info(`user deleted: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, replace, del };
