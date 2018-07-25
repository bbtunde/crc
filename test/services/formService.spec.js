var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var AppError = require('../../models/AppError');
const TestHelper = require('./../testHelper');
var FormService = require('./../../services/formService');
var requestHandlers = require('./../../config/requireHandlers').handlers;

describe('Form Service', function () {

    it('getForm - resolves', async () => {
        try {
            let serviceKey = 'airtime.prepaid.etranzact.mtn';
            let body = {};

            let form = {
                "serviceKey": "airtime.prepaid.etranzact.mtn",
                "elements": [
                    {
                        "key": "phone_number",
                        "template": "phone_with_country",
                        "title": "What is your phone number?",
                        "label": "Phone number?",
                        "validators": [
                            {
                                "type": "required",
                                "options": [],
                                "message": "This field is required"
                            }
                        ],
                        "options": [
                            {
                                "label": "Nigeria",
                                "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Nigeria.jpg",
                                "option_value": "NG_+234",
                                "preselected": false,
                                "form_elements": []
                            }
                        ]
                    }
                ],
                "step": 1,
                "stepCount": 1
            };

            var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
            var getAirtimeStub = sinon.stub(requestHandlers, 'noRequestHandler');

            validateAndGetNextStepStub.returns({
                isLast: false,
                appError: null,
                currentStep: 1,
                validator: [],
                stepCount: 1,
                requestHandler: "noRequestHandler",
                fields: [
                    {
                        "key": "phone_number",
                        "template": "phone_with_country",
                        "title": "What is your phone number?",
                        "label": "Phone number?",
                        "validators": [
                            {
                                "type": "required",
                                "options": [],
                                "message": "This field is required"
                            }
                        ],
                        "options": [
                            {
                                "label": "Nigeria",
                                "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Nigeria.jpg",
                                "option_value": "NG_+234",
                                "preselected": false,
                                "form_elements": []
                            }
                        ]
                    }
                ]
            });

            getAirtimeStub.resolves(form);

            let result = FormService.getForm(serviceKey, body);

            const testResult = await result;

            expect(testResult).to.equal(form);
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub, getAirtimeStub]);
        } catch (error) {
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub, getAirtimeStub]);
            throw (error);
        }
    });

    it('getForm - rejects because of response callback causing an error', async () => {
        try {
            let serviceKey = 'airtime.prepaid.etranzact.mtn';
            let body = {};

            var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
            var getAirtimeStub = sinon.stub(requestHandlers, 'noRequestCall');

            validateAndGetNextStepStub.returns({
                isLast: false,
                currentStep: 1,
                validator: [],
                stepCount: 1,
                requestHandler: "noRequestCall"
            });

            var testError = {"error":"test expected error"};

            getAirtimeStub.rejects(testError);

            let result = FormService.getForm(serviceKey, body);

            const testResult = await result;
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub, getAirtimeStub]);
        } catch (error) {
            TestHelper.resetStubAndSpys([validateAndGetNextStepStub, getAirtimeStub]);
            expect(error).to.equal(testError);
        }
    });

    it('getForm - is last step', function (done) {
        let serviceKey = 'airtime.prepaid.etranzact.mtn';
        let body = {};

        var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
        var getAirtimeStub = sinon.stub(requestHandlers, 'noRequestCall');

        validateAndGetNextStepStub.returns({
            isLast: true,
            currentStep: 1,
            validator: [],
            stepCount: 1,
            requestHandler: "noRequestCall"
        });

        getAirtimeStub.resolves({});

        FormService.getForm(serviceKey, body).then((result) => {
            assert.deepEqual(result, {
                "serviceKey": 'airtime.prepaid.etranzact.mtn',
                "elements": []
            })
            done();
        }).catch(e => {console.log(e); done();});

        TestHelper.resetStubAndSpys([validateAndGetNextStepStub, getAirtimeStub]);
    });
    
    it('getForm - bad handler', function (done) {
        let serviceKey = 'tv.prepaid.dstv';
        let body = {};

        var validateAndGetNextStepStub = sinon.stub(FormService, 'validateAndGetNextStep');
        var badRequestHandlerStub = sinon.stub(requestHandlers, 'noRequestHandler');

        validateAndGetNextStepStub.returns({
            isLast: false,
            currentStep: 1,
            validator: [],
            stepCount: 1,
            requestHandler: "noRequestHandler"
        });

        badRequestHandlerStub.rejects({error: "error"});

        FormService.getForm(serviceKey, body).then((result) => {
        }).catch(e => {
            let expected = new AppError(500,'UNKNOWN_ERROR', 'Error building form elements from handler', []);
            assert.deepEqual(e, expected);
            done();
        });

        TestHelper.resetStubAndSpys([validateAndGetNextStepStub, badRequestHandlerStub]);
    });

    it('tests validateAndGetNextStep function single step', function () {
       var formService = rewire('./../../services/formService');

       let serviceKey = 'my.service.key';
       let body = {};

       formService.__get__('availableServices')['my.service.key'] = {
           "steps": [
               {
                   "fields": [
                       {
                        "key": "phone_number",
                        "title": "What is your phone number?",
                        "label": "Phone Number",
                        "template": "phone_with_country",
                        "validators": [
                          {
                            "type": "required",
                            "options": [],
                            "message": "Phone number required"
                          }
                        ],
                        "options": []
                      },
                   ],
                   "requestHandler": "noRequestCall"
               }
           ]
       };

       let result = formService.validateAndGetNextStep(serviceKey, body);

       expect(result).to.have.property('isLast');
       expect(result).to.have.property('currentStep');
       expect(result).to.have.property('fields');
       expect(result).to.have.property('stepCount');
       expect(result).to.have.property('requestHandler');

       assert.isBoolean(result.isLast);
       assert.isNumber(result.currentStep);
       assert.isArray(result.fields);
       assert.isNumber(result.stepCount);
       assert.isString(result.requestHandler);

       assert.isFalse(result.isLast);
       assert.isTrue(result.currentStep == 1);
       assert.isTrue(result.stepCount == 1);
    });

    it('tests validateAndGetNextStep function two steps', function () {

        FormService = rewire('../../services/formService.js');

        let serviceKey = 'my.service.key';
        let body = { phone_number: "+20123456789" };

        FormService.__get__('availableServices')['my.service.key'] = {
            "steps": [
                {
                    "fields": [
                        {
                         "key": "phone_number",
                         "title": "What is your phone number?",
                         "label": "Phone Number",
                         "template": "phone_with_country",
                         "validators": [
                           {
                             "type": "required",
                             "options": [],
                             "message": "Phone number required"
                           }
                         ],
                         "options": []
                       },
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                },
                {
                    "fields": [
                        {
                         "key": "amount",
                         "title": "Charged Amount",
                         "label": "Amount",
                         "template": "money",
                         "validators": [
                           {
                             "type": "required",
                             "options": [],
                             "message": "Amount required"
                           }
                         ],
                         "options": []
                       },
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                }
            ]
        };

        let result = FormService.validateAndGetNextStep(serviceKey, body);

        expect(result).to.have.property('isLast');
        expect(result).to.have.property('currentStep');
        expect(result).to.have.property('fields');
        expect(result).to.have.property('stepCount');
        expect(result).to.have.property('requestHandler');

        assert.isBoolean(result.isLast);
        assert.isNumber(result.currentStep);
        assert.isArray(result.fields);
        assert.isNumber(result.stepCount);
        assert.isString(result.requestHandler);

        assert.isFalse(result.isLast);
        assert.isTrue(result.currentStep == 2);
        assert.isTrue(result.stepCount == 2);
    });

    it('tests validateAndGetNextStep function multiple steps and multiple fields', function () {

        FormService = rewire('../../services/formService.js');

        let serviceKey = 'my.service.key';
        let body = {
            contract_type: "prepaid",
            operator: "vodafone",
            phone_number: "+20123456789",
            amount: "100"
        };

        FormService.__get__('availableServices')['my.service.key'] = {
            "steps": [
                {
                    "fields": [
                        {
                            "key": "contract_type",
                            "title": "What is your contract type?",
                            "label": "Contract type",
                            "template": "text",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        },
                        {
                            "key": "operator",
                            "title": "What is your operator?",
                            "label": "Operator",
                            "template": "text",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }

                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                },
                {
                    "fields": [
                        {
                            "key": "phone_number",
                            "title": "What is your phone number?",
                            "label": "Phone Number",
                            "template": "phone_with_country",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        },
                        {
                            "key": "amount",
                            "title": "Charged Amount",
                            "label": "Amount",
                            "template": "money",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                },
                {
                    "fields": [
                        {
                            "key": "foo",
                            "title": "Foo",
                            "label": "Foo",
                            "template": "text",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                }
            ]
        };

        let result = FormService.validateAndGetNextStep(serviceKey, body);

        expect(result).to.have.property('isLast');
        expect(result).to.have.property('currentStep');
        expect(result).to.have.property('fields');
        expect(result).to.have.property('stepCount');
        expect(result).to.have.property('requestHandler');

        assert.isBoolean(result.isLast);
        assert.isNumber(result.currentStep);
        assert.isArray(result.fields);
        assert.isNumber(result.stepCount);
        assert.isString(result.requestHandler);

        assert.isFalse(result.isLast);
        assert.isTrue(result.currentStep == 3);
        assert.isTrue(result.stepCount == 3);
    });

    it('tests validateAndGetNextStep function missing step fields', function () {
        FormService = rewire('../../services/formService.js');

        let serviceKey = 'my.service.key';
        let body = {
            contract_type: "prepaid",
            operator: "vodafone",
            phone_number: "+20123456789"
        };

        FormService.__get__('availableServices')['my.service.key'] = {
            "steps": [
                {
                    "fields": [
                        {
                            "key": "contract_type",
                            "title": "What is your contract type?",
                            "label": "Contract type",
                            "template": "text",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        },
                        {
                            "key": "operator",
                            "title": "What is your operator?",
                            "label": "Operator",
                            "template": "text",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }

                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                },
                {
                    "fields": [
                        {
                            "key": "phone_number",
                            "title": "What is your phone number?",
                            "label": "Phone Number",
                            "template": "phone_with_country",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        },
                        {
                            "key": "amount",
                            "title": "Charged Amount",
                            "label": "Amount",
                            "template": "money",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                }
            ]
        };

        let result = FormService.validateAndGetNextStep(serviceKey, body);

        expect(result).to.have.property('isLast');
        expect(result).to.have.property('currentStep');
        expect(result).to.have.property('fields');
        expect(result).to.have.property('stepCount');
        expect(result).to.have.property('requestHandler');

        assert.isBoolean(result.isLast);
        assert.isNumber(result.currentStep);
        assert.isArray(result.fields);
        assert.isNumber(result.stepCount);
        assert.isString(result.requestHandler);

        assert.isFalse(result.isLast);
        assert.isTrue(result.currentStep == 2);
        assert.isTrue(result.stepCount == 2);
    });

    it('tests validateAndGetNextStep function without more steps', function () {
        FormService = rewire('../../services/formService.js');

        let serviceKey = 'my.service.key';
        let body = {
            phone_number: "+20123456789"
        };

        FormService.__get__('availableServices')['my.service.key'] = {
            "steps": [
                {
                    "fields": [
                        {
                            "key": "phone_number",
                            "title": "What is your phone number?",
                            "label": "Phone Number",
                            "template": "phone_with_country",
                            "validators": [
                                {
                                    "type": "required",
                                    "options": [
                                    ],
                                    "message": "This field is required"
                                }
                            ]
                        }
                    ],
                    "requestHandler": "dummySingleStepRequestCall"
                }
            ]
        };

        let result = FormService.validateAndGetNextStep(serviceKey, body);

        expect(result).to.have.property('isLast');
        expect(result).to.have.property('currentStep');
        expect(result).to.have.property('fields');
        expect(result).to.have.property('stepCount');
        expect(result).to.have.property('requestHandler');

        assert.isBoolean(result.isLast);
        assert.isNumber(result.currentStep);
        assert.isArray(result.fields);
        assert.isNumber(result.stepCount);
        assert.isNull(result.requestHandler);

        assert.isTrue(result.isLast);
    });
})