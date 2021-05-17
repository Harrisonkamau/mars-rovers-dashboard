const { validateBaseUrl } = require('../../lib');
const { expect } = require('../setup');

describe('#validateBaseUrl', () => {
  context('Given an base URL is undefined', () => {
    it('Then returns the default URL', async () => {
      const result = await validateBaseUrl();
      expect(result).to.eq('https://api.nasa.gov/mars-photos/api/v1/rovers');
    });
  });

  context('Given there is an API KEY', async () => {
    it('Then it is returned', async () => {
      const result = await validateBaseUrl('https://api.nasa.gov/base-url');
      expect(result).to.eq('https://api.nasa.gov/base-url');
      expect(result).to.not.eq('https://api.nasa.gov/mars-photos/api/v1/rovers');
    });
  });
});
