const DEFAULT_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';

/**
 * Checks whether a NASA Base URL is provided
 * @param {string} url - NASA API key
 * @returns {string} the provided URL or a default one
 */
async function validateApiBaseUrl(url) {
  if (!url) {
    return DEFAULT_URL
  }

  return url;
}

module.exports = validateApiBaseUrl;
