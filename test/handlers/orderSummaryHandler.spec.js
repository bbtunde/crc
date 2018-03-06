const request = require('request');
const PaymentDetailItem = require('./../../models/PaymentDetailItem');
var ParseUtils = require('./../../services/parseUtils');
const availableServices = require('./../../config/requireServices').services;
var requestHandlers = require('./../../config/requireHandlers').handlers;
const chai = require('chai');
const expect = require('expect');
const assert = chai.assert;
const sinon = require('sinon');
const TestHelper = require('./../testHelper');
const QuoteResponse = require('./../../models/QuoteResponse');
const AppError = require('./../../models/AppError');
const ResponseCode = require('./../../models/ResponseCode');


describe('Order Summary Handler',function()
{
	var serviceKey="tv.paga.dstv";
	
	it('order summary- resolves with quoteResponse',async function()
	{
		let body = {
            "smart_card_number":"41157294764",
            "amount": "NGN_1500.ACCESS"
        };
		let amountValue=1500;
		let currency="NGN";
        let fee=105;
        let total_amount=amountValue+fee;
		let mockQuoteResponse = new QuoteResponse(
                availableServices[serviceKey].destination,
                [],
                [new PaymentDetailItem('total_price', total_amount, [{ "currency": currency,"amount":amountValue,"fee":fee }])]
            );
		
		let parseMoneyAmountStub=sinon.stub(ParseUtils,'parseMoneyAmountValue');
		parseMoneyAmountStub.returns(1500);
		let parseMoneyCurrencyStub=sinon.stub(ParseUtils,'parseMoneyCurrencyValue');
		parseMoneyCurrencyStub.returns("NGN");
		
		let result=requestHandlers['orderSummaryHandler'](serviceKey, body);
		const quoteResponse= await result;
		assert.deepEqual(quoteResponse,mockQuoteResponse);
		TestHelper.resetStubAndSpys([parseMoneyAmountStub,parseMoneyCurrencyStub]);

	});

	it('order summary - reject with amount not properly formated',async function()
	{
		let body = {
            "smart_card_number": "41157294764",
            "amount": "NGN100"
        };

		let result = requestHandlers['orderSummaryHandler'](serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {

            let expectedAppError= new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []);
           	assert.deepEqual(error,expectedAppError);
            };  	
	});


	it('order summary - reject with amount value not number',async function()
	{
		let body = {
            "smart_card_number": "41157294764",
            "amount": "NGN_100"
        };

		let result = requestHandlers['orderSummaryHandler'](serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {
            let expectedAppError=new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []);
           	assert.deepEqual(error,expectedAppError);
            };     	
	});
})

