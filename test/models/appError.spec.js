var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var AppError = require('./../../models/AppError');

describe('AppError', function () {
  it('get an AppError instance', function() {

    let instance = new AppError(400, 'INVALID_REQUEST', 'Invalid sign up form request', [{"username":"must not be empty"}]);

    expect(instance).to.have.property('httpStatusCode');
    assert.isTrue(instance.httpStatusCode === 400);

    expect(instance).to.have.property('code');
    assert.isTrue(instance.code === 'INVALID_REQUEST');

    expect(instance).to.have.property('response');
    assert.isTrue(instance.response === 'Invalid sign up form request');

    expect(instance).to.have.property('errors');
    assert.isTrue(JSON.stringify(instance.errors) === JSON.stringify([{"username":"must not be empty"}]));
  });
})
