const svc = require("../services/userService");

const UserType = {
  name: "User",
  fields: {
    id: { type: "String" },
    name: { type: "String" },
    email: { type: "String" },
    role: { type: "String" },
    createdAt: { type: "String" },
  },
};

const QueryType = {
  name: "Query",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: "String" } },
      resolve: (parent, args) => svc.getById(args.id),
    },
    users: {
      type: [UserType],
      args: { role: { type: "String" }, limit: { type: "Int", defaultValue: 10 } },
      resolve: (parent, args) => {
        let users = svc.getAll();
        if (args.role) users = users.filter((u) => u.role === args.role);
        return users.slice(0, args.limit);
      },
    },
  },
};

const MutationType = {
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: { name: { type: "String" }, email: { type: "String" }, role: { type: "String" } },
      resolve: (parent, args) => svc.create({ name: args.name, email: args.email, role: args.role }),
    },
    updateUser: {
      type: UserType,
      args: { id: { type: "String" }, name: { type: "String" }, email: { type: "String" }, role: { type: "String" } },
      resolve: (parent, args) => {
        const updates = {};
        if (args.name) updates.name = args.name;
        if (args.email) updates.email = args.email;
        if (args.role) updates.role = args.role;
        return svc.update(args.id, updates);
      },
    },
    deleteUser: {
      type: "Boolean",
      args: { id: { type: "String" } },
      resolve: (parent, args) => {
        svc.delete(args.id);
        return true;
      },
    },
  },
};

module.exports = { query: QueryType, mutation: MutationType };
