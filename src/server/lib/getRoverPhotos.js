const axios = require('axios');
const validateApiKey = require('./validateApiKey');
const validateBaseUrl = require('./validateBaseUrl');
const handleAxiosError = require('./handleAxiosError');

/**
 * Fetches a rovers photos
 * @param {string} roverName - name of the rover.
 * @returns {<any>} either an error or a status code + rover photos
 */
async function getRoverPhotos(roverName) {
  try {
    const { NASA_API_KEY, NASA_BASE_API_URL } = process.env;
    const validatedApiKey = await validateApiKey(NASA_API_KEY);
    const validatedBaseUrl = await validateBaseUrl(NASA_BASE_API_URL);
    const response = await axios.request({
      method: 'get',
      params: { roverName },
      url: `${validatedBaseUrl}/${roverName}/photos?sol=1000&api_key=${validatedApiKey}`,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

module.exports = getRoverPhotos;
