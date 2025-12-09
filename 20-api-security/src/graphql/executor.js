const resolvers = require("./resolvers");

class GraphQLExecutor {
  static async execute(query, variables = {}) {
    try {
      const parsed = this.parse(query);
      return parsed.type === "query" ? await this.execQuery(parsed, variables) : await this.execMutation(parsed, variables);
    } catch (error) {
      return { errors: [{ message: error.message }] };
    }
  }

  static parse(query) {
    const match = query.match(/^\s*(query|mutation)\s*{/i);
    if (!match) throw new Error("invalid query format");
    return { type: match[1].toLowerCase(), fields: this.extract(query) };
  }

  static extract(query) {
    const fields = {};
    const regex = /(\w+)\s*({[^}]*}|(?:\([^)]*\))?(?!\()|$)/g;
    let match;
    while ((match = regex.exec(query)) !== null) {
      const fieldName = match[1];
      if (!["query", "mutation", "Query", "Mutation"].includes(fieldName)) {
        fields[fieldName] = match[2];
      }
    }
    return fields;
  }

  static async execQuery(parsed, variables) {
    const results = {}, errors = [];
    for (const [fieldName, fieldContent] of Object.entries(parsed.fields)) {
      try {
        const args = this.parseArgs(fieldContent);
        const resolver = resolvers.Query[fieldName];
        if (!resolver) {
          errors.push({ message: `unknown field: ${fieldName}` });
          continue;
        }
        results[fieldName] = resolver(null, args);
      } catch (error) {
        errors.push({ message: error.message, field: fieldName });
      }
    }
    const response = { data: results };
    if (errors.length > 0) response.errors = errors;
    return response;
  }

  static async execMutation(parsed, variables) {
    const results = {}, errors = [];
    for (const [fieldName, fieldContent] of Object.entries(parsed.fields)) {
      try {
        const args = this.parseArgs(fieldContent);
        const resolver = resolvers.Mutation[fieldName];
        if (!resolver) {
          errors.push({ message: `unknown mutation: ${fieldName}` });
          continue;
        }
        results[fieldName] = resolver(null, args);
      } catch (error) {
        errors.push({ message: error.message, field: fieldName });
      }
    }
    const response = { data: results };
    if (errors.length > 0) response.errors = errors;
    return response;
  }

  static parseArgs(content) {
    const args = {};
    const regex = /(\w+):\s*"([^"]*)"|(\w+):\s*(\d+)|(\w+):\s*(\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) args[match[1]] = match[2];
      else if (match[3]) args[match[3]] = parseInt(match[4]);
      else if (match[5]) args[match[5]] = match[6];
    }
    return args;
  }
}

module.exports = { execute: (...args) => GraphQLExecutor.execute(...args) };
