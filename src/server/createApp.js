require('dotenv').config();

const express = require('express');
const { errors: joiErrors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const publicRoutes = require('./routes');

const isDev = process.env.NODE_ENV === 'development';

/**
 * Creates an Express application, registering routes & relevant middleware
 * @returns {void} void
 */
async function createApp(corsOptions = {}) {
  try {
    const app = express();

    // register middleware
    app.use(bodyParser.json());

    app.use(cors(corsOptions));

    // only log requests in Dev environment
    if (isDev) {
      app.use(morgan('dev'));
    }

    // custom middleware to lowercase request params
    app.use(async (req, res, next) => {
      if (req.url.startsWith('/api/v1/rovers')) {
        const [baseUrl, requestParam] = req.url.split('/rovers/');
        req.url = `${baseUrl}/rovers/${requestParam.toLowerCase()}`;
      }

      await next();
    });

    // register routes
    publicRoutes.forEach((r) => app.use(r));

    // catch Celebrate validation errors
    app.use(joiErrors());

    return app;
  } catch (error) {
    console.log('An error occurred while creating an Express app', error);
    process.exit();
  }
}

module.exports = createApp;
