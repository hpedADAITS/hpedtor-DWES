const UserService = require("../services/userService");
const { validateUser } = require("../utils/validation");

const resolvers = {
  Query: {
    user: (parent, args) => {
      try {
        return UserService.getUserById(args.id);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    users: (parent, args) => {
      try {
        let users = UserService.getAllUsers();

        if (args.role) {
          users = users.filter((u) => u.role === args.role);
        }

        if (args.search) {
          const searchLower = args.search.toLowerCase();
          users = users.filter(
            (u) =>
              u.name.toLowerCase().includes(searchLower) ||
              u.email.toLowerCase().includes(searchLower),
          );
        }

        if (args.sortBy) {
          const [field, order] = args.sortBy.split(":");
          const ascending = order !== "desc";
          users.sort((a, b) => {
            if (a[field] < b[field]) return ascending ? -1 : 1;
            if (a[field] > b[field]) return ascending ? 1 : -1;
            return 0;
          });
        }

        const limit = args.limit || 10;
        return users.slice(0, limit);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createUser: (parent, args) => {
      try {
        const errors = validateUser(
          {
            name: args.name,
            email: args.email,
            role: args.role,
          },
          true,
        );

        if (errors.length > 0) {
          throw new Error(`Validation Error: ${errors.join(", ")}`);
        }

        return UserService.createUser({
          name: args.name,
          email: args.email,
          role: args.role,
        });
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

        const errors = validateUser(updates, false);
        if (errors.length > 0) {
          throw new Error(`Validation Error: ${errors.join(", ")}`);
        }

        return UserService.updateUser(args.id, updates);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteUser: (parent, args) => {
      try {
        UserService.deleteUser(args.id);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
