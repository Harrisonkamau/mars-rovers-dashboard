/**
 * Class representing an ApiKeyError
 */
class ApiKeyError extends Error {
  /**
   * Creating an apiKeyError
   * @param {String} message - the error message
   * @returns {ApiKeyError} an ApiKeyError object
   */
  constructor(message) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

module.exports = ApiKeyError;
