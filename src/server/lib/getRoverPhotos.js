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
    const validatedApiKey = await validateApiKey(process.env.NASA_API_KEY);
    const validatedBaseUrl = await validateBaseUrl(process.env.NASA_BASE_API_URL);
    const response = await axios.request({
      method: 'get',
      params: { roverName },
      url: `${validatedBaseUrl}/mars-photos/api/v1/rovers/${roverName}/photos?sol=1000&api_key=${validatedApiKey}`,
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
