const { ApiKeyError } = require('../errors');

/**
 * Checks whether a NASA API KEY is provided
 * @param {string} apiKey - NASA API key
 * @returns either an error or a valid api key
 */
async function validateApiKey(apiKey) {
  if (!apiKey) {
    throw new ApiKeyError('Missing NASA API Key');
  }

  return apiKey;
}

module.exports = validateApiKey;
