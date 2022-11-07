const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./db');
const routers = require('./routers');
const errorHandler = require('./middlewares/errorHandler');
const errorCodes = require('./utils/errorCodes');
const { swaggerUi, specs } = require('./swagger');
const redisConenct = require('./db/redis');
const path = require('path');

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Synced database.');
  })
  .catch((err) => {
    console.log('Failed to sync database: ' + err.message);
  });

app.use(redisConenct);
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', routers);
app.use((req, res) => {
  res.status(404).json({ message: errorCodes.pageNotFound });
});
app.use(errorHandler);
module.exports = app;
