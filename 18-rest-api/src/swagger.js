const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RESTful Users API",
      version: "1.0.0",
      description:
        "A comprehensive REST API for managing users with authentication, filtering, sorting, and pagination",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
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
            id: {
              type: "string",
              description: "User unique identifier",
              example: "1",
            },
            name: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              example: 404,
            },
            error: {
              type: "string",
              example: "NOT_FOUND",
            },
            message: {
              type: "string",
              example: "User not found",
            },
            details: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["validation error 1", "validation error 2"],
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                },
                user: {
                  type: "object",
                  properties: {
                    userId: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                    role: {
                      type: "string",
                      enum: ["user", "admin"],
                    },
                  },
                },
              },
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
