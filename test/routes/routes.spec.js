var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var router = require('../../routes/routes.js');

describe('Routes', function () {
  it('checks router properties', function() {
    expect(router).to.be.a('function');

    var server = {
      'get': function(a, b){},
      'post': function(a, b){}
    };

    var getSpy = sinon.spy(server, 'get'),
    postSpy = sinon.spy(server, 'post');

    router(server);

    assert.isTrue(getSpy.callCount === 2);
    assert.isTrue(postSpy.callCount === 3);
  });
})
