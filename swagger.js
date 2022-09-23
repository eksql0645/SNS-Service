const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'SNS Service',
      description: 'SNS service API document입니다.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // 요청 URL
      },
    ],
  },
  apis: ['./routers/*.js'], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
