var rewire = require('rewire');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var utils = rewire('./../../services/utils');

describe('Utils', function () {
  it('checks utils properties', function() {
    expect(utils).to.have.property('logError');
    expect(utils.logError).to.be.a('function');

    var errorCallbackSpy = sinon.spy(utils.__get__('fs'), 'appendFile');

    utils.logError({message: 'some message'});

    assert.isTrue(errorCallbackSpy.called);
    errorCallbackSpy.restore();
  });
})
