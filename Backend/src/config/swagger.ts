import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Lunoa API',
      version: '1.0.0',
      description: 'API documentation for the Lunoa project',
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication related endpoints',
      },
      {
        name: 'Users',
        description: 'User management related endpoints',
      },
      {
        name: 'Quests',
        description: 'Quest management related endpoints',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Quest: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            creator_id: { type: 'string' },
            reward: { type: 'number' },
            currency: { type: 'string', enum: ['Lunoa', 'USDC'] },
            type: { type: 'string', enum: ['social', 'location_based'] },
            status: { type: 'string', enum: ['active', 'completed', 'expired'] },
            created_at: { type: 'string', format: 'date-time' },
            expires_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/api/v1/**/*.ts'], // Path to all API route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
