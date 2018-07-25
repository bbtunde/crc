var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var AppError = require('../../models/AppError');
const TestHelper = require('./../testHelper');
const FormService = require('./../../services/formService');

describe('Order Service', function () {

    it('getOrderSummary - resolves', async () => {
        const OrderService = require('./../../services/orderService');

        let serviceKey = 'multistep.form';
        let body = {
            "phone_number_one": "aaaaa",
            "amount": "NGN_100",
            "phone_number_two": "bbbbb",
            "phone_number_three": "cccc"
        };

        let result = OrderService.getOrderSummary(serviceKey, body);

        const testResult = await result;

        let expectedResult = {
            destination: "phone_number_one",
            additional_details: [],
            payment_details: [
                {
                    type: "total_price",
                    value: 100,
                    options: [
                        {
                            currency: "NGN"
                        }
                    ]
                }
            ],
            success_purchase_message: null
        };

        expect(testResult).to.deep.equal(expectedResult);
    });

    it('getOrderSummary - rejects with AppError', async () => {
        const OrderService = require('./../../services/orderService');
        const RequestHandlers = require('./../../config/requireHandlers').handlers;

        let serviceKey = 'multistep.form';
        let body = {
            "phone_number_one": "aaaaa",
            "phone_number_two": "bbbbb",
            "phone_number_three": "cccc"
        };

        let result = OrderService.getOrderSummary(serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {
            let expectedResult = {
                code: "INVALID_REQUEST",
                errors: [
                    {
                        message: "Missing field",
                        property: "amount"
                    }
                ],
                httpStatusCode: 400,
                response: "Form values are incorrect. Invalid fields at step 1 of 3.",
                extraInfo:[]
            };

            expect(error).to.deep.equal(expectedResult);
        }
    });

    it('getOrderSummary - rejects with RequestHandler Error', async () => {
        try {
            var OrderService = rewire('./../../services/orderService');
            var RequestHandlers = require('./../../config/requireHandlers').handlers;

            OrderService.__set__("RequestHandlers", RequestHandlers);
            OrderService.__get__("RequestHandlers");

            var testOrderSummaryHandlerStub = sinon.stub(RequestHandlers, 'testOrderSummaryHandler');
            testOrderSummaryHandlerStub.rejects('Error parsing amount from body');

            let serviceKey = 'multistep.form';
            let body = {
                "phone_number_one": "aaaaa",
                "amount": "NGN_100",
                "phone_number_two": "bbbbb",
                "phone_number_three": "cccc"
            };

            let result = OrderService.getOrderSummary(serviceKey, body);

            try {
                const testResult = await result;
            } catch (error) {
                let expectedResult = { "httpStatusCode": 500, "code": "UNKNOWN_ERROR", "response": "Error building order summary from handler", "errors": [],extraInfo:[] };

                expect(JSON.stringify(error)).to.deep.equal(JSON.stringify(expectedResult));
                TestHelper.resetStubAndSpys([testOrderSummaryHandlerStub]);
            }
        } catch (error) {
            TestHelper.resetStubAndSpys([testOrderSummaryHandlerStub]);
            throw (error);
        }
    });

    it('getOrderSummary - rejects with AppError as a result from distributor', async () => {
        try {
            const OrderService = rewire('./../../services/orderService');
            const RequestHandlers = require('./../../config/requireHandlers').handlers;

            OrderService.__set__("RequestHandlers", RequestHandlers);
            OrderService.__get__("RequestHandlers");

            let errorMessage = 'Please make sure your operator and meter number are correct. ' +
                'Otherwise, please check your account status with your operator.';
            let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);

            var testOrderSummaryHandlerStub = sinon.stub(RequestHandlers, 'testOrderSummaryHandler');
            testOrderSummaryHandlerStub.rejects(appError);

            let serviceKey = 'multistep.form';
            let body = {
                "phone_number_one": "aaaaa",
                "amount": "NGN_100",
                "phone_number_two": "bbbbb",
                "phone_number_three": "cccc"
            };

            let result = OrderService.getOrderSummary(serviceKey, body);

            try {
                const testResult = await result;
            } catch (error) {
                let expectedResult = appError;

                expect(JSON.stringify(error)).to.deep.equal(JSON.stringify(expectedResult));
                TestHelper.resetStubAndSpys([testOrderSummaryHandlerStub]);
            }
        } catch (error) {
            TestHelper.resetStubAndSpys([testOrderSummaryHandlerStub]);
            throw (error);
        }
    });

    it('getOrderSummary - rejects with order summary handler not defined', async () => {
        try {
            const OrderService = rewire('./../../services/orderService');
            const FormService = require('./../../services/formService');

            OrderService.__set__("FormService", FormService);
            OrderService.__get__("FormService");

            let stepMock = { "errors": [] };
            var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
            validateAndGetNextStepStub.returns(stepMock);

            let serviceKey = 'multistep.form';
            let body = {
                "phone_number_one": "aaaaa",
                "amount": "NGN_100",
                "phone_number_two": "bbbbb",
                "phone_number_three": "cccc"
            };

            let result = OrderService.getOrderSummary(serviceKey, body);

            try {
                const testResult = await result;
            } catch (error) {
                let expectedResult = { "httpStatusCode": 500, "code": "UNKNOWN_ERROR", "response": "Order summary handler is not defined.", "errors": [],extraInfo:[] };

                expect(JSON.stringify(error)).to.deep.equal(JSON.stringify(expectedResult));
                TestHelper.resetStubAndSpys([validateAndGetNextStepStub]);
            }
        } catch (error) {
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub]);
            throw (error);
        }
    });

    it('makePurchase - resolves', async () => {
        const OrderService = require('./../../services/orderService');

        let serviceKey = 'multistep.form';
        let body = {
            "phone_number_one": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "phone_number_two": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "phone_number_three": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "amount": "NGN_10"
        };

        let result = OrderService.makePurchase(serviceKey, body);

        const testResult = await result;

        let expectedResult = {
            transaction_reference: 'mock_reference',
            distributor_response: {
                balance: 0,
                status: "Success"
            },
            extra_info: 'mock_message',
            generated_reference:"mock_generated_reference"
        };

        expect(testResult).to.deep.equal(expectedResult);
    });

    it('makePurchase - invalid request', async () => {
        const OrderService = require('./../../services/orderService');

        let serviceKey = 'multistep.form';
        let body = {
            "phone_number_one": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "amount": "NGN_10"
        };
        var expectedResult = {
            "code": "INVALID_REQUEST",
            "errors": [
                {
                    "message": "Missing field",
                    "property": "phone_number_two"
                }
            ],
            "httpStatusCode": 400,
            "response": "Form values are incorrect. Invalid fields at step 2 of 3.",
            "extraInfo":[]
            
        };

        let result = OrderService.makePurchase(serviceKey, body)
            .catch(error => {
                expect(error).to.deep.equal(expectedResult);
            });

        const testResult = await result;
    });


    it('makePurchase - rejects with RequestHandler Error', async () => {
        var RequestHandlers = require('./../../config/requireHandlers').handlers;
        var OrderService = rewire('./../../services/orderService.js');

        OrderService.__set__("RequestHandlers", RequestHandlers);
        OrderService.__get__("RequestHandlers");

        var noPurchaseHandlerStub = sinon.stub(RequestHandlers, 'noPurchaseHandler');

        let serviceKey = 'multistep.form';
        let body = {
            "phone_number_one": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "phone_number_two": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "phone_number_three": {
                "user_input": "NG_07034774592",
                "national": "07034774592",
                "international": "+23407034774592",
                "country_code": "NG"
            },
            "amount": "NGN_10"
        };

        // purchase handler rejects object
        noPurchaseHandlerStub.rejects('mock reject');
        let result = OrderService.makePurchase(serviceKey, body);

        try {
            const testResult = await result;
        } catch (error) {
            let expected = {
                httpStatusCode: 500,
                code: 'UNKNOWN_ERROR',
                response: `Error ocurred while processing purchase request from handler`,
                errors: [],
                extraInfo:[]
            };

            expect(error).to.deep.equal(expected);
        }

        // purchase handler rejects object from etranzact
        noPurchaseHandlerStub.rejects({ response: { message: 'mock reject' } });
        result = OrderService.makePurchase(serviceKey, body);

        try {
            testResult = await result;
        } catch (error) {
            let expected = {
                httpStatusCode: 500,
                code: 'UNKNOWN_ERROR',
                response: `Error ocurred while processing purchase request from handler`,
                errors: [],
                extraInfo:[]
            };

            expect(error).to.deep.equal(expected);
        }
    });

    it('makePurchase - rejects with order summary handler not defined', async () => {
        try {
            const OrderService = rewire('./../../services/orderService');
            const FormService = require('./../../services/formService');

            OrderService.__set__("FormService", FormService);
            OrderService.__get__("FormService");

            let stepMock = { "errors": [] };
            var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
            validateAndGetNextStepStub.returns(stepMock);

            let serviceKey = 'multistep.form';
            let body = {
                "phone_number_one": "aaaaa",
                "amount": "NGN_100",
                "phone_number_two": "bbbbb",
                "phone_number_three": "cccc"
            };

            let result = OrderService.makePurchase(serviceKey, body);

            try {
                const testResult = await result;
            } catch (error) {
                let expectedResult = { "httpStatusCode": 500, "code": "INVALID_PURCHASE_HANDLER", "response": "No valid purchase handler for multistep.form", "errors": [],"extraInfo":[] };

                expect(JSON.stringify(error)).to.deep.equal(JSON.stringify(expectedResult));
                TestHelper.resetStubAndSpys([validateAndGetNextStepStub]);
            }
        } catch (error) {
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub]);
            throw (error);
        }
    });
})
