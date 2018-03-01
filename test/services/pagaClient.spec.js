var rewire = require('rewire');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var PagaClient = require('./../../services/pagaClient');

describe('PagaClient', function () {
  it('checks isSuccessResponse', function () {
    let result = PagaClient.isSuccessResponse({});
    assert.equal(result, false);

    result = PagaClient.isSuccessResponse({ responseCode: 0 });
    assert.equal(result, true);

    result = PagaClient.isSuccessResponse({ responseCode: 1 });
    assert.equal(result, false);
  });
})
