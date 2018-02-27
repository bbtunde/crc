var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

const AdditionalDetailItem = require('./../../models/AdditionalDetailItem');

describe('AdditionalDetailItem', function () {
    it('get a AdditionalDetailItem instance', function () {

        let instance = new AdditionalDetailItem('total_price', 100);

        expect(instance).to.have.property('label');
        assert.isTrue(instance.label === 'total_price');

        expect(instance).to.have.property('value');
        assert.isTrue(instance.value === 100);
    });
})
