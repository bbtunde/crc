var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

const PaymentDetailItem = require('./../../models/PaymentDetailItem');

describe('Validators', function () {
    it('get a PaymentDetailItem instance', function () {

        let options = [
            {
                "currency": "NGN"
            }
        ];
        let instance = new PaymentDetailItem('total_price', 100, options);

        expect(instance).to.have.property('type');
        assert.isTrue(instance.type === 'total_price');

        expect(instance).to.have.property('value');
        assert.isTrue(instance.value === 100);

        expect(instance).to.have.property('options');
        assert.isTrue(instance.options === options);
    });
})
