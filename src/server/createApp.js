const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const publicRoutes = require('./routes');

const isDev = process.env.NODE_ENV === 'development';

/**
 * Creates an Express application, registering routes & relevant middleware
 * @returns {void} void
 */
async function createApp() {
  try {
    const app = express();

    // register middleware
    app.use(bodyParser.json());

    if (isDev) {
      app.use(morgan('dev'));
    }

    // register routes
    app.use('/', publicRoutes);

    return app;
  } catch (error) {
    console.log('An error occurred while creating an Express app', error);
    process.exit();
  }
}

module.exports = createApp;
