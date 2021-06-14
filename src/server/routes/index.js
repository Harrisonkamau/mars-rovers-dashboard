const homeRoute = require('./home');
const roversRoutes = require('./rovers');
const apodRoutes = require('./apod');

module.exports = [
  homeRoute,
  apodRoutes,
  roversRoutes,
];
