const { validateApiKey } = require('../../lib');
const { ApiKeyError } = require('../../errors');
const { expect, assert } = require('../setup');

describe('#validateApiKey', () => {
  context('Given an API KEY is undefined', () => {
    it('Then it raises an ApiKey error', async () => {
      try {
        await validateApiKey();
      } catch (error) {
        assert.instanceOf(error, ApiKeyError);
      }
    });
  });

  context('Given there is an API KEY', async () => {
    it('Then it is returned', async () => {
      const result = await validateApiKey('valid-api-key');
      expect(result).to.eq('valid-api-key');
    });
  });
});
