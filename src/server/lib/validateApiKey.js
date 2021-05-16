const { ApiKeyError } = require('../errors');

/**
 * Checks whether a NASA API KEY is provided
 * @param {string} apiKey - NASA API key
 * @returns either an error or a valid api key
 */
function validateApiKey(apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new ApiKeyError('Missing NASA API Key'));
    }

    resolve(apiKey);
  });
}

module.exports = validateApiKey;
