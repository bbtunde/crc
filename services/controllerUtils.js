const config = require('./../config/config.json');
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
        if (error instanceof AppError) {
            return next(response.json(error.httpStatusCode, new AppResponse(error.code, error.response, error.errors)));
        } else {
            return next(response.json(500, new AppResponse(ResponseCode.UNKNOWN_ERROR, { "errorMessage": `Unkown error ocurred. Error: ${error}` }, [])));
        }
    }
    

    static isRequestWithValidCredentials(request) {
        return config.access.username === request.header('username') && config.access.password === request.header('password');
    }


    static isRequestWithValidBody(request) {
        try {
            return typeof request.body === 'object' ? true : false;
        } catch (error) {
            return false;
        }
    }
}