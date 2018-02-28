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


describe('Internet Order Summary Handler',function()
{
	var serviceKey="internet.paga.spectranet";
	

	it('internet order summary- resolves with quoteResponse',async function()
	{
		let body = {
            "customer_id": "10164177",
            "amount": "NGN_100"
        };
		let amountValue=100;
		let currency="NGN";
        let fee=105;
        let total_amount=amountValue+fee;
		let mockQuoteResponse = new QuoteResponse(
                availableServices[serviceKey].destination,
                [],
                [new PaymentDetailItem('total_price', total_amount, [{ "currency": currency,"amount":amountValue,"fee":fee }])]
            );
		
		let parseMoneyAmountStub=sinon.stub(ParseUtils,'parseMoneyAmountValue');
		parseMoneyAmountStub.returns(100);
		let parseMoneyCurrencyStub=sinon.stub(ParseUtils,'parseMoneyCurrencyValue');
		parseMoneyCurrencyStub.returns("NGN");
		
		let result=requestHandlers['internetOrderSummaryHandler'](serviceKey, body);
		const quoteResponse= await result;
		assert.deepEqual(quoteResponse,mockQuoteResponse);
		TestHelper.resetStubAndSpys([parseMoneyAmountStub,parseMoneyCurrencyStub]);

	});

	it('internet order summary - reject with amount not properly formated',async function()
	{
		let body = {
            "customer_id": "10164177",
            "amount": "NGN100"
        };

		let result = requestHandlers['internetOrderSummaryHandler'](serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {

            let expectedAppError= new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []);
           	assert.deepEqual(error,expectedAppError);
            };  	
	});


	it('internet order summary - reject with amount value not number',async function()
	{
		let body = {
            "customer_id": "10164177",
            "amount": "NGN_100"
        };

		let result = requestHandlers['internetOrderSummaryHandler'](serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {
            let expectedAppError=new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []);
           	assert.deepEqual(error,expectedAppError);
            };     	
	});
})

