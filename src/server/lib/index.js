const getRoverPhotos = require('./getRoverPhotos');
const getPicOfTheDay = require('./getPicOfTheDay');
const validateApiKey = require('./validateApiKey');
const validateBaseUrl = require('./validateBaseUrl');
const roverSchema = require('./roverSchema');
const handleAxiosError = require('./handleAxiosError');

module.exports = {
  getRoverPhotos,
  getPicOfTheDay,
  handleAxiosError,
  roverSchema,
  validateApiKey,
  validateBaseUrl,
};
