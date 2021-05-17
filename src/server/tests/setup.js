const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const { expect, assert } = chai;

module.exports = { expect, assert };
