var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var validators = require('./../../models/Validators');

describe('Validators', function () {
  it('get a Validator instance', function() {

    let instance = new validators.Validator('validator test type', 'validator test options', 'validator test error messages');

    expect(instance).to.have.property('type');
    assert.isTrue(instance.type === 'validator test type');

    expect(instance).to.have.property('options');
    assert.isTrue(instance.options === 'validator test options');

    expect(instance).to.have.property('message');
    assert.isTrue(instance.message === 'validator test error messages');
  });

  it('get a RegexValidator instance', function() {
    let instance = new validators.RegexValidator('validator test type', 'validator test options', 'validator test error messages', '[//**/validator_regex]');

    expect(instance).to.have.property('type');
    assert.isTrue(instance.type === 'validator test type');

    expect(instance).to.have.property('options');
    assert.isTrue(instance.options === 'validator test options');

    expect(instance).to.have.property('message');
    assert.isTrue(instance.message === 'validator test error messages');

    expect(instance).to.have.property('regexExpression');
    assert.isTrue(instance.regexExpression === '[//**/validator_regex]');
  });
})
