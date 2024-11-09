import { Options } from "swagger-jsdoc";

const swaggerDefinition: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PixelTurbo API",
      version: "1.0.0",
      description:
        "API documentation for PixelTurbo - Facebook Pixel Management System",
      contact: {
        name: "API Support",
        email: "support@pixelturbo.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            'JWT token for authentication. Prefix token with "Bearer "',
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            status: {
              type: "integer",
            },
            requestId: {
              type: "string",
            },
            timestamp: {
              type: "string",
              format: "date-time",
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
              description: "User email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT access token",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                name: {
                  type: "string",
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password (min 8 characters)",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            phone: {
              type: "string",
              description: "User phone number (optional)",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerDefinition;
