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

describe('purchase Handler',function()
{
	var serviceKey="tv.paga.dstv";
	const requestHandlers = require('./../../config/requireHandlers').handlers;
	
	it('purchase -with transaction reference', async function()
	{
		let body = {
            "smart_card_number": "41157294764",
            "amount": "NGN_100"
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


	

    it('purchase - reject with Missing amount ', async function()
    {
        let body = {
            "smart_card_number": "41157294764"
        };
        
        let result = requestHandlers['purchaseHandler'](serviceKey, body);
        let expectedAppError=new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []);
        try {
            const testResult = await result;
        } catch (error) {
            expect(error).to.deep.equal(expectedAppError);
            };  

       
    });


})