var rewire = require('rewire');
const chai = require('chai');
const expect = require('expect');
const assert = chai.assert;
const sinon = require('sinon');
var FormService = require('./../../services/formService');
var formsController = require('./../../controllers/formsController');
var ControllerUtils = require('./../../services/controllerUtils');
var Utils = require('./../../services/utils');
const TestHelper = require('./../testHelper');
const AppResponse = require('./.././../models/AppResponse');

describe('Forms Controller', function () {

  it('getFormType - success', function (done) {
    try {
      let formElementsMock = {
        "service_key": "airtime.prepaid.etranzact.mtn",
        "elements": [
          {
            "key": "phone_number",
            "template": "phone_with_country",
            "label": "Phone Number",
            "validator": null,
            "options": [
              {
                "label": "Nigeria",
                "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Nigeria.jpg",
                "option_value": "+234",
                "message": "",
                "preselected": false,
                "form_elements": []
              }
            ]
          }
        ]
      };

      let args = {
        request: {
          params: {
            'service-key': 'airtime.prepaid.etranzact.mtn'
          },
          body: formElementsMock
        },
        response: {
          json: function () { }
        },
        next: function () { },
        formElements: formElementsMock
      };

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      var jsonCallbackSpy = sinon.spy(args.response, 'json');
      var nextSpy = sinon.spy(args, "next");

      var getFormStub = sinon.stub(FormService, "getForm");
      getFormStub.resolves(formElementsMock);

      formsController.getFormType(args.request, args.response, args.next);
      setTimeout(function() {
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
          isRequestWithValidServiceKeyStub,
          isRequestWithValidBodyStub,
          jsonCallbackSpy,
          getFormStub
        ]);
        done();
      }, 10);

    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        isRequestWithValidBodyStub,
        jsonCallbackSpy,
        getFormStub
      ]);
      throw (error);
    }
  });


  it('getFormType - error on FormService getform', function (done) {
    try {
      let formElementsMock = {
        "service_key": "hello.world",
        "elements": [
          {
            "key": "phone_number",
            "template": "phone_with_country",
            "label": "Phone Number",
            "validator": null,
            "options": [
              {
                "label": "Egypt",
                "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Egypt.jpg",
                "option_value": "+20",
                "message": "",
                "preselected": false,
                "form_elements": []
              },
              {
                "label": "Kenya",
                "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Kenya.jpg",
                "option_value": "+254",
                "message": "",
                "preselected": false,
                "form_elements": []
              }
            ]
          }
        ]
      };

      let args = {
        request: {
          params: {
            'service-key': 'hello.world'
          },
          body: formElementsMock
        },
        response: {
          json: function () { }
        },
        next: function () { },
        formElements: formElementsMock
      };

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      var jsonCallbackSpy = sinon.spy(args.response, 'json');
      var nextSpy = sinon.spy(args, "next");

      var sendErrorResponseSpy = sinon.spy(ControllerUtils, 'sendErrorResponse');

      var getFormStub = sinon.stub(FormService, "getForm");
      getFormStub.rejects({"error":"expected unit test error"});

      formsController.getFormType(args.request, args.response, args.next);
      setTimeout(function() {
        assert.isTrue(sendErrorResponseSpy.called);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
          isRequestWithValidServiceKeyStub,
          isRequestWithValidBodyStub,
          jsonCallbackSpy,
          sendErrorResponseSpy,
          getFormStub
        ]);
        done();
      }, 10);

    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        isRequestWithValidBodyStub,
        jsonCallbackSpy,
        sendErrorResponseSpy,
        getFormStub
      ]);
      throw (error);
    }
  });

   it('getFormType - error', function () {
     try {
       var request = {};
       var response = { 'json': function () { } };
       var next = function () { };

       var sendErrorResponseSpy = sinon.spy(ControllerUtils, 'sendErrorResponse');

       formsController.getFormType(request, response, next);

       expect(sendErrorResponseSpy.called).toBe(true);

       TestHelper.resetStubAndSpys([sendErrorResponseSpy]);
     } catch (error) {
       TestHelper.resetStubAndSpys([sendErrorResponseSpy]);
       throw (error);
     }
   });

  it('getFormType - no header authentication', function () {
    try {
      let payload = new AppResponse('INVALID_AUTHENTICATION', "Header must contain valid username and password", []);

      let args = {
        request: {},
        response: {
          json: function () { }
        },
        next: function () { }
      };

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(false);

      var responseJsonSpy = sinon.spy(args.response, 'json');

      formsController.getFormType(args.request, args.response, args.next);

      assert.isTrue(responseJsonSpy.calledWithExactly(401, payload));

      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        responseJsonSpy
      ]);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        responseJsonSpy
      ]);
      throw (error);
    }
  });

  it('getFormType - no valid body', function () {
    try {
      let payload = new AppResponse('INVALID_BODY', "Request must contain a valid body", []);

      let args = {
        request: {},
        response: {
          json: function () { }
        },
        next: function () { }
      };

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var responseJsonSpy = sinon.spy(args.response, 'json');

      formsController.getFormType(args.request, args.response, args.next);

      assert.isTrue(responseJsonSpy.calledWithExactly(400, payload));

      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        responseJsonSpy
      ]);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        responseJsonSpy
      ]);
      throw (error);
    }
  });

  it('getFormType - no service key', function () {
    try {
      let errorPayload = new AppResponse('INVALID_SERVICE_KEY', "Request URL must contain a valid service key", []);
      let args = {
        request: {},
        response: {
          json: function () { }
        },
        next: function () { },
        payload: errorPayload
      };

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(false);

      var responseJsonSpy = sinon.spy(args.response, 'json');

      formsController.getFormType(args.request, args.response, args.next);

      assert.isTrue(responseJsonSpy.calledWithExactly(400, errorPayload));

      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        responseJsonSpy
      ]);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
        isRequestWithValidServiceKeyStub,
        responseJsonSpy
      ]);
      throw (error);
    }
  });
})
