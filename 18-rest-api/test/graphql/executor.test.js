const GraphQLExecutor = require("../../src/graphql/executor");
const User = require("../../src/models/User");

describe("GraphQL Executor", () => {
  beforeEach(() => {
    User.reset();
  });

  describe("Query Parsing", () => {
    it("should parse a simple query", () => {
      const query = "query { users { id name } }";
      const parsed = GraphQLExecutor.parseQuery(query);

      expect(parsed).toHaveProperty("type", "query");
      expect(parsed).toHaveProperty("fields");
    });

    it("should return error for invalid query format", async () => {
      const query = "invalid query format";

      const result = await GraphQLExecutor.execute(query);

      expect(result).toHaveProperty("errors");
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe("Query Execution", () => {
    it("should execute a valid query", async () => {
      const query = "query { users }";

      const result = await GraphQLExecutor.execute(query);

      expect(result).toHaveProperty("data");
    });
  });

  describe("Argument Extraction", () => {
    it("should extract string arguments", () => {
      const content = `user(id: "123")`;
      const args = GraphQLExecutor.extractArguments(content);

      expect(args).toHaveProperty("id", "123");
    });

    it("should extract numeric arguments", () => {
      const content = `users(limit: 10)`;
      const args = GraphQLExecutor.extractArguments(content);

      expect(args).toHaveProperty("limit", 10);
    });

    it("should extract multiple arguments", () => {
      const content = `users(role: "admin", limit: 5)`;
      const args = GraphQLExecutor.extractArguments(content);

      expect(args).toHaveProperty("role", "admin");
      expect(args).toHaveProperty("limit", 5);
    });
  });
});
