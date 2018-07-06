const AppError = require('./../models/AppError');
var RequestHandlers = require('./../config/requireHandlers').handlers;
var FormService = require('./formService');
const ResponseCode = require('./../models/ResponseCode');

module.exports = class OrderService {

    /**
     * @param { String } serviceKey
     * @param { Object } body
     */
    static getOrderSummary(serviceKey, body) {
        var promiseCallback = function (resolve, reject) {
            let step = FormService.validateAndGetNextStep(serviceKey, body);

            if (step.errors.length > 0) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Form values are incorrect. Invalid fields at step ${step.currentStep} of ${step.stepCount}.`, step.errors));
            }

            let paymentDetails = {};
            if (step.orderSummaryHandler !== undefined && typeof RequestHandlers[step.orderSummaryHandler] === 'function') {
                RequestHandlers[step.orderSummaryHandler](serviceKey, body)
                    .then((paymentDetails) => {
                        return resolve(paymentDetails);
                    })
                    .catch((error) => {
                        if (error instanceof AppError) {
                            return reject(error);
                        }
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error building order summary from handler', []));
                    })
            } else {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Order summary handler is not defined.', []));
            }
        };

        return new Promise(promiseCallback.bind(this));
    }

    /**
     * Create a purchase on Etranzact side
     * @param {Object} body
     */
    static makePurchase(serviceKey, body) {

        return new Promise((resolve, reject) => {
            let step = FormService.validateAndGetNextStep(serviceKey, body);
            if (step.errors.length > 0) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Form values are incorrect. Invalid fields at step ${step.currentStep} of ${step.stepCount}.`, step.errors));
            }
            //For now assume only the first item, if in the future more items are added to a purchase loop here the entire delivery
            let purchaseHandler = step.purchaseHandler;

            if (purchaseHandler !== undefined && typeof RequestHandlers[purchaseHandler] === 'function') {
                RequestHandlers[purchaseHandler](serviceKey, body)
                    .then((successPurchase) => {
                        resolve(successPurchase);
                    })
                    .catch((error) => {
                        if (error instanceof AppError) {
                            return reject(error);
                        }                       
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error ocurred while processing purchase request from handler`, []));
                    });
            } else {
                return reject(new AppError(500, ResponseCode.INVALID_PURCHASE_HANDLER, 'No valid purchase handler for ' + serviceKey, []));
            }
        });
    }
}
