const { handleAxiosError } = require('../../lib');
const { expect } = require('../setup');

describe('#handleAxiosError', () => {
  context('Given there is an error.response', () => {
    it('Then returns the status & data', async () => {
      const error = {
        response: {
          data: { statusText: 'Missing API KEY' },
          status: 400,
        },
      };

      const result = await handleAxiosError(error);
      expect(result).to.deep.equal({
        status: 400,
        error: { statusText: 'Missing API KEY' },
      });
    });
  });

  context('Given there is NO error.response', async () => {
    it('Then it returns a server error & the message ', async () => {
      const error = { message: 'Missing API KEY' };
      const result = await handleAxiosError(error);

      expect(result).to.deep.equal({
        status: 500,
        error: 'Missing API KEY',
      });
    });
  });
});
