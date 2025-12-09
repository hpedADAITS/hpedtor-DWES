const svc = require("../services/userService");
const { validate } = require("../utils/validation");

module.exports = {
  Query: {
    user: (parent, args) => {
      try {
        return svc.getById(args.id);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    users: (parent, args) => {
      try {
        let users = svc.getAll();
        if (args.role) users = users.filter((u) => u.role === args.role);
        if (args.search) {
          const lower = args.search.toLowerCase();
          users = users.filter((u) =>
            u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
          );
        }
        if (args.sortBy) {
          const [field, order] = args.sortBy.split(":");
          const asc = order !== "desc";
          users.sort((a, b) => {
            if (a[field] < b[field]) return asc ? -1 : 1;
            if (a[field] > b[field]) return asc ? 1 : -1;
            return 0;
          });
        }
        return users.slice(0, args.limit || 10);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      try {
        const errors = validate({ name: args.name, email: args.email, role: args.role }, true);
        if (errors.length > 0) throw new Error(`validation: ${errors.join(", ")}`);
        return svc.create({ name: args.name, email: args.email, role: args.role });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateUser: (parent, args) => {
      try {
        const updates = {};
        if (args.name) updates.name = args.name;
        if (args.email) updates.email = args.email;
        if (args.role) updates.role = args.role;
        const errors = validate(updates, false);
        if (errors.length > 0) throw new Error(`validation: ${errors.join(", ")}`);
        return svc.update(args.id, updates);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteUser: (parent, args) => {
      try {
        svc.delete(args.id);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
