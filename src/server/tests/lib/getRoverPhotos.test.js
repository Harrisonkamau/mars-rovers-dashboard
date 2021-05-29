const sinon = require('sinon');
const axios = require('axios');
const { getRoverPhotos } = require('../../lib');
const { createNasaPhotosSuccessResponse } = require('../__mocks__/nasaApi');
const { expect, assert } = require('../setup');

describe('#getRoverPhotos', () => {
  let axiosRequestStub;
  let apiKeyStub;

  before(() => {
    axiosRequestStub = sinon.stub(axios, 'request');
    apiKeyStub = sinon.stub(process.env, 'NASA_API_KEY').value('sample-valid-api-key');
  });

  after(() => {
    axiosRequestStub.restore();
    apiKeyStub.restore();
  });

  context('Given the API KEY & base URL are valid', () => {
    it('Then it fetches a rovers photos', async () => {
      const response = createNasaPhotosSuccessResponse();
      const requestStub = axiosRequestStub.resolves(Promise.resolve(response));
      const res = await getRoverPhotos('curiosity');

      expect(res).to.deep.equal({
        status: 200,
        data: response.data,
      });

      assert.equal(requestStub.calledOnce, true);
    });
  });

  context('Given the base URL is valid', () => {
    context('And the API KEY is invalid', async () => {
      it('Then it does not fetch rovers photos', async () => {
        const apiResponse = createNasaPhotosSuccessResponse();
        const requestStub = axiosRequestStub.resolves(Promise.resolve(apiResponse));
        apiKeyStub.value(undefined);

        await getRoverPhotos('curiosity');
        assert.equal(requestStub.calledOnce, false);
      });
    });
  });
});
