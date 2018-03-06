var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var health = require('./../../controllers/healthController.js');

describe('Health Controller', function () {
  it('displays a welcome message', function() {
    var response = {'json': function(){}};
    var obj = {
      callback: function(){}
    };

    var jsonCallbackSpy = sinon.spy(response, 'json'),
        callbackSpy = sinon.spy(obj, 'callback');

    health.getHealth(null, response, obj.callback);

    let result = {
      "code": "SUCCESS",
      "response" : "You know for PAGA adapter",
      "errors": []
    };

    assert.isTrue(jsonCallbackSpy.withArgs(200, result).calledOnce);
    assert.isTrue(callbackSpy.calledOnce);
  });
})
