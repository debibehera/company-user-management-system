const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
    info: {
        title: 'Company & User Management API',
        description: 'API documentation for managing companies and users',
    },
    host:'localhost:5000', // Change this when deployed
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles);
