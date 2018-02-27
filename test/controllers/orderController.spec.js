var rewire = require('rewire');
const chai = require('chai');
const expect = require('expect');
const assert = chai.assert;
const sinon = require('sinon');
var Utils = require('./../../services/utils');
const TestHelper = require('./../testHelper');
const AppResponse = require('./../../models/AppResponse');

describe('Order Controller', function () {

  it('orderSummary - success', function (done) {
    try {
      const orderController = rewire('./../../controllers/orderController');
      const ControllerUtils = require('./../../services/controllerUtils');

      orderController.__set__("ControllerUtils", ControllerUtils);
      orderController.__get__("ControllerUtils");

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      let args = {
        request: {
          "body":   {
            "amount": "NGN_100",
            "phone_number_one": "aaaaa",
            "phone_number_two": "bbbbb",
            "phone_number_three": "cccc"
          },
          "params": { "service-key": "multistep.form" }
        },
        response: {
          json: function () {
            return true;
          }
        },
        next: function () {}
      };

      var nextSpy = sinon.spy(args, "next");

      let result = orderController.orderSummary(args.request, args.response, args.next);

      setTimeout(function() {
        assert.isTrue(nextSpy.called);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, nextSpy]);
        done();
      }, 10);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, nextSpy]);
      throw (error);
    }
  });

  it('orderSummary - rejects - reason missing field', function (done) {
    try {
      const orderController = rewire('./../../controllers/orderController');
      const ControllerUtils = require('./../../services/controllerUtils');

      orderController.__set__("ControllerUtils", ControllerUtils);
      orderController.__get__("ControllerUtils");

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      var sendErrorResponseSpy = sinon.spy(ControllerUtils, 'sendErrorResponse');

      var request = {
        "body": { "phone_number_one": "aaaaa" },
        "params": { "service-key": "multistep.form" }
      }
      var response = {
        json: function () { }
      };

      var next = function () { };

      orderController.orderSummary(request, response, next);
      setTimeout(function() {
        assert.isTrue(sendErrorResponseSpy.calledOnce);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy]);
        done();
      }, 10);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy]);
      throw (error);
    }
  });

   it('orderSummary - rejects - generic error', function (done) {
     try {
       const orderController = rewire('./../../controllers/orderController');
       const ControllerUtils = require('./../../services/controllerUtils');

       orderController.__set__("ControllerUtils", ControllerUtils);
       orderController.__get__("ControllerUtils");

       var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
       isRequestWithValidCredentialsStub.returns(true);

       var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
       isRequestWithValidServiceKeyStub.returns(true);

       var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
       isRequestWithValidBodyStub.returns(true);

       var sendErrorResponseSpy = sinon.spy(ControllerUtils, 'sendErrorResponse');

       var request = {
         "body": { "phone_number_one": "aaaaa" }
       }
       var response = {
         json: function () { }
       };

       var next = function () { };

       orderController.orderSummary(request, response, next);
       setTimeout(function() {
         assert.isTrue(sendErrorResponseSpy.calledOnce);
         TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy]);
         done();
       }, 10);
     } catch (error) {
       TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy]);
       throw (error);
     }
   });

   it('makePurchase - success', function () {
     const orderController = require('./../../controllers/orderController');

     try {
       let args = {
         request: {},
         response: {
           json: function () { }
         },
         next: function () { }
       };

       var jsonCallbackSpy = sinon.spy(args.response, 'json');
       var nextSpy = sinon.spy(args, 'next');

       orderController.makePurchase(args.request, args.response, args.next);
       assert.isTrue(jsonCallbackSpy.calledOnce);
       assert.isTrue(nextSpy.calledOnce);

       TestHelper.resetStubAndSpys([jsonCallbackSpy,
         nextSpy
       ]);
     } catch (error) {
       TestHelper.resetStubAndSpys([jsonCallbackSpy,
         nextSpy
       ]);
       throw (error);
     }
   });

  it('orderSummary - no header authentication', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.orderSummary(args.request, args.response, args.next);

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

  it('orderSummary - no valid body', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.orderSummary(args.request, args.response, args.next);

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

  it('orderSummary - no service key', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.orderSummary(args.request, args.response, args.next);

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

  it('makepurchase - success', function (done) {
    try {
      const orderController = rewire('./../../controllers/orderController');
      const ControllerUtils = require('./../../services/controllerUtils');
      const OrderService = require('./../../services/orderService');

      orderController.__set__("ControllerUtils", ControllerUtils);
      orderController.__get__("ControllerUtils");

      orderController.__set__("OrderService", OrderService);
      orderController.__get__("OrderService");

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      var OrderServiceMakePurchaseStub = sinon.stub(OrderService, 'makePurchase');
      OrderServiceMakePurchaseStub.returns(new Promise((resolve, reject) => {
        resolve({
          balance: 123123
        });
      }));

      let args = {
        request: {
          "body":   {
            "phone_number": {
              "user_input": "NG_07034774592",
              "national": "07034774592",
              "international": "+23407034774592",
              "country_code": "NG"
            },
            "amount": "NGN_10"
          },
          "params": { "service-key": "multistep.form" }
        },
        response: {
          json: function () {
            return true;
          }
        },
        next: function () {}
      };

      var nextSpy = sinon.spy(args, "next");

      let result = orderController.makePurchase(args.request, args.response, args.next);

      setTimeout(function() {
        assert.isTrue(nextSpy.called);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, nextSpy, OrderServiceMakePurchaseStub]);
        done();
      }, 10);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, nextSpy, OrderServiceMakePurchaseStub]);
      throw (error);
    }
  });

  it('makepurchase - rejects - reason internal errors', function (done) {
    try {
      const orderController = rewire('./../../controllers/orderController');
      const ControllerUtils = require('./../../services/controllerUtils');
      const OrderService = require('./../../services/orderService');

      orderController.__set__("ControllerUtils", ControllerUtils);
      orderController.__get__("ControllerUtils");

      orderController.__set__("OrderService", OrderService);
      orderController.__get__("OrderService");

      var isRequestWithValidCredentialsStub = sinon.stub(ControllerUtils, 'isRequestWithValidCredentials');
      isRequestWithValidCredentialsStub.returns(true);

      var isRequestWithValidServiceKeyStub = sinon.stub(ControllerUtils, 'isRequestWithValidServiceKey');
      isRequestWithValidServiceKeyStub.returns(true);

      var isRequestWithValidBodyStub = sinon.stub(ControllerUtils, 'isRequestWithValidBody');
      isRequestWithValidBodyStub.returns(true);

      var OrderServiceMakePurchaseStub = sinon.stub(OrderService, 'makePurchase');
      OrderServiceMakePurchaseStub.returns(new Promise((resolve, reject) => {
        throw 'Unhandled error';
      }));

      var sendErrorResponseSpy = sinon.spy(ControllerUtils, 'sendErrorResponse');

      var request = {
        "body": { "phone_number_one": "aaaaa" },
        "params": { "service-key": "multistep.form" }
      }
      var response = {
        json: function () { }
      };

      var next = function () { };

      orderController.makePurchase(request, response, next);
      setTimeout(function() {
        assert.isTrue(sendErrorResponseSpy.calledOnce);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy, OrderServiceMakePurchaseStub]);
        done();
      }, 10);
    } catch (error) {
      TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub, isRequestWithValidServiceKeyStub, isRequestWithValidBodyStub, sendErrorResponseSpy, OrderServiceMakePurchaseStub]);
      throw (error);
    }
  });

  it('makepurchase - no header authentication', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.makePurchase(args.request, args.response, args.next);

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

  it('makepurchase - no valid body', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.makePurchase(args.request, args.response, args.next);

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

  it('makepurchase - no service key', function () {
    const orderController = rewire('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

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

      orderController.makePurchase(args.request, args.response, args.next);

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

  it('makePurchase - error', function () {
    const orderController = require('./../../controllers/orderController');
    const ControllerUtils = require('./../../services/controllerUtils');

    try {
      let request = {};
      var response = { 'json': function () { } };
      let next = function () { };

      var sendErrorResponseStub = sinon.stub(ControllerUtils, 'sendErrorResponse');
      sendErrorResponseStub.onCall(0).returns(true);

      let result = orderController.makePurchase(request, null, next);
      assert.isTrue(sendErrorResponseStub.called);

      TestHelper.resetStubAndSpys([sendErrorResponseStub]);
    } catch (error) {
      TestHelper.resetStubAndSpys([sendErrorResponseStub]);
      throw (error);
    }
  });
})
