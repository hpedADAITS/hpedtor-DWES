const swagger = require("swagger-jsdoc");

const opts = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "REST API que maneja usuarios",
    },
    servers: [
      { url: "http://localhost:3000", description: "dev" },
      { url: "https://api.example.com", description: "prod" },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "role"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            code: { type: "integer" },
            error: { type: "string" },
            message: { type: "string" },
            details: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    security: [{ Bearer: [] }],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swagger(opts);
