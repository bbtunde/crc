const request = require('request');
var ParseUtils = require('./../../services/parseUtils');
const availableServices = require('./../../config/requireServices').services;
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const PurchaseResponse = require('./../../models/PurchaseResponse');
const AppError = require('./../../models/AppError');
const ResponseCode = require('./../../models/ResponseCode');

describe('Airtime Purchase Handler',function()
{
	var serviceKey="airtime.prepaid.paga.mtn";
	const requestHandlers = require('./../../config/requireHandlers').handlers;
	
	it('airtime purchase -with transaction reference', async function()
	{
		let body = {
            "phone_number": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "amount": "NGN_10"
        };
        let mockDistributorResponse = {
                status: 'Success',
                balance: 0
            };
            let expectedResult = new PurchaseResponse('mock_reference', mockDistributorResponse, 'mock_message');
       
		let result = requestHandlers['noPurchaseHandler'](serviceKey, body);
        const testResult = await result;
        assert.deepEqual(testResult,expectedResult);
		
	});


	it('airtime purchase - reject with Missing phone number ', async function()
	{
		let body = {
            "amount": "NGN_10"
        };
		
		let result = requestHandlers['airtimePurchaseHandler'](serviceKey, body);
        let expectedAppError=new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "phone_number" in body`, []);

        try {
            const testResult = await result;
        } catch (error) {
           	expect(error).to.deep.equal(expectedAppError);
            };  

       
	});

    it('airtime purchase - reject with Missing amount ', async function()
    {
        let body = {
            "phone_number": {}
        };
        
        let result = requestHandlers['airtimePurchaseHandler'](serviceKey, body);
        let expectedAppError=new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []);
        try {
            const testResult = await result;
        } catch (error) {
            expect(error).to.deep.equal(expectedAppError);
            };  

       
    });


})