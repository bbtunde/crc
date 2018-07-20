var availableServices = require('../config/requireServices').services;
const config = require('./../config/config.json');
const Utils = require('./utils');
const ResponseCode = require('./../models/ResponseCode');
const AppResponse = require('./../models/AppResponse');
const AppError = require('./../models/AppError');

module.exports = class ControllerUtils {

    /**
     * 
     * @param {AppError|Object} error 
     * @param {Object} response 
     * @param {*} next 
     */
    static sendErrorResponse(error, response, next) {
        if(error instanceof AppError){
            error.response={
                "errorMessage":error.response,
                "extraInfo":error.extraInfo
            };
            return next(response.json(error.httpStatusCode, new AppResponse(error.code, error.response, error.errors)));
        } else {
            console.log('Unkown type of error ocurred: ', error);
            return next(response.json(500, new AppResponse(ResponseCode.UNKNOWN_ERROR, {"errorMessage":`Unkown error ocurred. Check server console log. Timestamp: ${Date.now()}`}, [])));
        }
    }

    static isRequestWithValidCredentials(request) {
        return config.manifest.username === request.header('username') && config.manifest.password === request.header('password');
    }

    static isRequestWithValidServiceKey(request) {
        if(request.params['service-key']
        && typeof request.params['service-key'] === 'string'
        && ControllerUtils.isValidServiceKey(request.params['service-key'])){
            return true;
        }
        return false;
    }

    static isValidServiceKey(serviceKey) {
        if (availableServices[serviceKey]) {
            return true;
        }
        return false;
    }

    static isRequestWithValidBody(request) {
        try {
            return typeof request.body === 'object' ? true : false;
        } catch (error) {
            return false;
        }
    }
}
