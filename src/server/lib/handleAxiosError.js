/**
 * Handles Request errors from Axios
 * @param {object} error - error object from Axios
 * @returns {object} errorObj - an error object with a status & an errorn message
 */
function handleAxiosError(error) {
  if (error && error.response) {
    return {
      error: error.response.data,
      status: error.response.status,
    };
  }

  return {
    status: 500,
    error: error.message,
  };
}

module.exports = handleAxiosError;
