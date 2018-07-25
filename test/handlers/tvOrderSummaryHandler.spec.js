const request = require('request');
const PaymentDetailItem = require('./../../models/PaymentDetailItem');
var ParseUtils = require('./../../services/parseUtils');
const availableServices = require('./../../config/requireServices').services;
var requestHandlers = require('./../../config/requireHandlers').handlers;
const chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
const sinon = require('sinon');
const TestHelper = require('./../testHelper');
const QuoteResponse = require('./../../models/QuoteResponse');
const AdditionalDetailItem = require('./../../models/AdditionalDetailItem');
const AppError = require('./../../models/AppError');
const ResponseCode = require('./../../models/ResponseCode');


describe('Order Summary Handler',function()
{
	console.log(availableServices);
	var serviceKey="tv.prepaid.dstv";
	
	it('order summary- resolves with quoteResponse',async function()
	{
		let body = {
            "smart_card_number":"41157294764",
            "service": "NGN_100.ACCESS"
        };
		let amountValue=100;
		let currency="NGN";
		let additionalDetail = new AdditionalDetailItem('Customer Name', "Mock User");
		let mockQuoteResponse = new QuoteResponse(
			availableServices[serviceKey].destination,
			[additionalDetail],
			[new PaymentDetailItem('total_price', amountValue, [{ "currency": currency}])]
		);
		
		let parseMoneyAmountStub=sinon.stub(ParseUtils,'parseMoneyAmountValue');
		parseMoneyAmountStub.returns(100);
		let parseMoneyCurrencyStub=sinon.stub(ParseUtils,'parseMoneyCurrencyValue');
		parseMoneyCurrencyStub.returns("NGN");
		let result=requestHandlers['tvOrderSummaryHandler'](serviceKey, body);
		const quoteResponse= await result;
		expect(quoteResponse).to.deep.equal(mockQuoteResponse);
		TestHelper.resetStubAndSpys([parseMoneyAmountStub,parseMoneyCurrencyStub]);

	});

	it('order summary - reject with amount not properly formated',async function()
	{
		let body = {
            "smart_card_number": "41157294764",
            "service": "NGN100"
        };

		let result = requestHandlers['tvOrderSummaryHandler'](serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {

            let expectedAppError= new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []);
			   expect(error).to.deep.equal(expectedAppError);
            };  	
	});


})

