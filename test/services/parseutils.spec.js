var rewire = require('rewire');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var utils = require('./../../services/parseUtils');

describe('ParseUtils', function () {
  it('checks parseMoneyAmountValue', function() {

    let value = utils.parseMoneyAmountValue('NGN_100');
    assert.equal(value, 100);
  });

  it('checks parseMoneyAmountValue invalid argument', function() {

    expect(utils.parseMoneyAmountValue).to.throw();

  });
  
  it('checks parseMoneyCurrencyValue', function() {

    let value = utils.parseMoneyCurrencyValue('NGN_100');
    assert.equal(value, 'NGN');
  });

  it('checks parseMoneyCurrencyValue invalid argument', function() {

    expect(utils.parseMoneyCurrencyValue).to.throw();

  });
  
  it('checks parseMoneyCurrencyValue invalid format', function() {

    expect(() => utils.parseMoneyCurrencyValue('NG')).to.throw();

  });
  
  it('checks parsePhoneNumberWithCountryValue', function() {

    let value = utils.parsePhoneNumberWithCountryValue('NG_07034774592');
    assert.equal(value, '07034774592');
  });

  it('checks parsePhoneNumberWithCountryValue invalid argument', function() {

    expect(utils.parsePhoneNumberWithCountryValue).to.throw();

  });
  
  it('checks parsePhoneNumberWithCountryValue invalid format', function() {

    expect(() => utils.parsePhoneNumberWithCountryValue('07034774592')).to.throw();

  });
  
  it('checks parsePhoneCodeValue', function() {

    let value = utils.parsePhoneCodeValue('NG_07034774592');
    assert.equal(value, 'NG');
  });

  it('checks parsePhoneCodeValue invalid argument', function() {

    expect(utils.parsePhoneCodeValue).to.throw();

  });
  
  it('checks parsePhoneCodeValue invalid format', function() {

    expect(() => utils.parsePhoneCodeValue('NG')).to.throw();

  });

})
