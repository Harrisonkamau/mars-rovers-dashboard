/**
 * Lib for interacting with NASA API to get the picture of the day
 */

const axios = require('axios');
const validateApiKey = require('./validateApiKey');
const validateBaseUrl = require('./validateBaseUrl');
const handleAxiosError = require('./handleAxiosError');

/**
 * Fetches a rovers photos
 * @param {void}
 * @returns {<any>} either an error or a status code + rover photos
 */
async function getPicOfTheDay() {
  try {
    const validatedApiKey = await validateApiKey(process.env.NASA_API_KEY);
    const validatedBaseUrl = await validateBaseUrl(process.env.NASA_BASE_API_URL);
    const response = await axios.request({
      method: 'get',
      url: `${validatedBaseUrl}/planetary/apod?api_key=${validatedApiKey}`,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

module.exports = getPicOfTheDay;
