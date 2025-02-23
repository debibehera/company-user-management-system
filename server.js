const express = require('express');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');

const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
