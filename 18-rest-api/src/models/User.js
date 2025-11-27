const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    createdAt: new Date("2024-01-02").toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: new Date("2024-01-03").toISOString(),
  },
];

let users = [...initialUsers];

class User {
  static getAll() {
    return users;
  }

  static getById(id) {
    return users.find((u) => u.id === id);
  }

  static create(data) {
    const newUser = {
      id: String(Math.max(...users.map((u) => parseInt(u.id)), 0) + 1),
      ...data,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  }

  static update(id, data) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...data,
    };
    return users[index];
  }

  static replace(id, data) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const replacedUser = {
      id,
      ...data,
      createdAt: users[index].createdAt,
    };
    users[index] = replacedUser;
    return replacedUser;
  }

  static delete(id) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }

  static reset() {
    users = [...initialUsers];
  }
}

module.exports = User;
