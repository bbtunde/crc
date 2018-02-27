var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var ControllerUtils = require('./../../services/controllerUtils');
var Utils = require('./../../services/utils');
var AppError = require('./../../models/AppError');
const config = require('./../../config/config.json');
const AppResponse = require('./../../models/AppResponse');

describe('ControllerUtils', function () {

    it('sendErrorResponse', function () {
        let appError = new AppError(500,'UNKNOWN_ERROR', "Internal server error", []);
        let payload = new AppResponse('UNKNOWN_ERROR', appError.response, appError.errors);

        var args = {
            appError: appError,
            response: { json: function () { } },
            next: function () { }
        }
    
        var logErrorSpy = sinon.spy(Utils, 'logError');
        var nextSpy = sinon.spy(args, 'next');
        var jsonSpy = sinon.spy(args.response, 'json');

        ControllerUtils.sendErrorResponse(args.appError, args.response, args.next);

        assert.isTrue(nextSpy.called);
        assert.isTrue(jsonSpy.calledWith(500, payload));

        logErrorSpy.restore();
        nextSpy.restore();
        jsonSpy.restore();
    });


    it('isRequestWithValidCredentials', function () {
        var args = {
            request: {
                header: function (key) {
                    if (key === "username") {
                        return config.manifest.username;
                    }
                    if (key === "password") {
                        return config.manifest.password;
                    }
                }
            },
            requestInvalid: {
                header: function (key) {
                    if (key === "username") {
                        return "dummy";
                    }
                    if (key === "password") {
                        return "dummy";
                    }
                }
            }
        }

        let result1 = ControllerUtils.isRequestWithValidCredentials(args.request, args.config);
        let result2 = ControllerUtils.isRequestWithValidCredentials(args.requestInvalid, args.config);
        assert.isTrue(result1);
        assert.isFalse(result2);
    });

    it('isRequestWithValidServiceKey', function () {
        let args = {
            request: {
                params: {'service-key' : 'electricity.postpaid.jos'}
            },
            request2: {
                params: {'service-key' : 'dummy'}
            }
        }

        var result = ControllerUtils.isRequestWithValidServiceKey(args.request);
        assert.isTrue(result);

        var result2 = ControllerUtils.isRequestWithValidServiceKey(args.request2);
        assert.isFalse(result2);
    });

    it('isRequestWithValidBody', function () {
        let args = {
            request: {
                body: {key : "value"}
            },
            request2: null,
            request3: {
                body: {}
            },

        }

        var result = ControllerUtils.isRequestWithValidBody(args.request);
        assert.isTrue(result);

        result = ControllerUtils.isRequestWithValidBody(args.request2);
        assert.isFalse(result);

        result = ControllerUtils.isRequestWithValidBody(args.request3);
        assert.isTrue(result);
    });
});
