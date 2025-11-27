const resolvers = require("./resolvers");

class GraphQLExecutor {
  static async execute(query, variables = {}) {
    try {
      const parsed = this.parseQuery(query);

      if (parsed.type === "query") {
        return await this.executeQuery(parsed, variables);
      } else if (parsed.type === "mutation") {
        return await this.executeMutation(parsed, variables);
      } else {
        throw new Error("Invalid query type");
      }
    } catch (error) {
      return {
        errors: [{ message: error.message }],
      };
    }
  }

  static parseQuery(query) {
    const operationMatch = query.match(/^\s*(query|mutation)\s*{/i);
    if (!operationMatch) {
      throw new Error("Invalid query format");
    }

    const type = operationMatch[1].toLowerCase();
    const fields = this.extractFields(query);

    return { type, fields };
  }

  static extractFields(query) {
    const fields = {};
    const fieldRegex = /(\w+)\s*({[^}]*}|(?:\([^)]*\))?(?!\()|$)/g;
    let match;

    while ((match = fieldRegex.exec(query)) !== null) {
      const fieldName = match[1];
      const fieldContent = match[2];

      if (!["query", "mutation", "Query", "Mutation"].includes(fieldName)) {
        fields[fieldName] = fieldContent;
      }
    }

    return fields;
  }

  static async executeQuery(parsed, variables) {
    const results = {};
    const errors = [];

    for (const [fieldName, fieldContent] of Object.entries(parsed.fields)) {
      try {
        const args = this.extractArguments(fieldContent);
        const resolver = resolvers.Query[fieldName];

        if (!resolver) {
          errors.push({
            message: `Unknown field: ${fieldName}`,
          });
          continue;
        }

        results[fieldName] = resolver(null, args);
      } catch (error) {
        errors.push({
          message: error.message,
          field: fieldName,
        });
      }
    }

    const response = { data: results };
    if (errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  static async executeMutation(parsed, variables) {
    const results = {};
    const errors = [];

    for (const [fieldName, fieldContent] of Object.entries(parsed.fields)) {
      try {
        const args = this.extractArguments(fieldContent);
        const resolver = resolvers.Mutation[fieldName];

        if (!resolver) {
          errors.push({
            message: `Unknown mutation: ${fieldName}`,
          });
          continue;
        }

        results[fieldName] = resolver(null, args);
      } catch (error) {
        errors.push({
          message: error.message,
          field: fieldName,
        });
      }
    }

    const response = { data: results };
    if (errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  static extractArguments(content) {
    const args = {};

    const argRegex = /(\w+):\s*"([^"]*)"|(\w+):\s*(\d+)|(\w+):\s*(\w+)/g;
    let match;

    while ((match = argRegex.exec(content)) !== null) {
      if (match[1]) {
        args[match[1]] = match[2];
      } else if (match[3]) {
        args[match[3]] = parseInt(match[4]);
      } else if (match[5]) {
        args[match[5]] = match[6];
      }
    }

    return args;
  }
}

module.exports = GraphQLExecutor;
