const PaymentDetailItem = require('./../models/PaymentDetailItem');
const QuoteResponse = require('./../models/QuoteResponse');
var ParseUtils = require('../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');

/* istanbul ignore next */
module.exports = {

    testOrderSummaryHandler: (serviceKey, body) => {
        return new Promise((resolve, reject) => {
            try {
                let amount = body['amount'];
                if(!amount.includes("_")){
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(amount);
                var currency = ParseUtils.parseMoneyCurrencyValue(amount);
                if(typeof amountValue != "number") {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, 'Amount is not properly formatted. It should be like: NGN_100', []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }

            let quoteResponse = new QuoteResponse(
                availableServices[serviceKey].destination,
                [],
                [new PaymentDetailItem('total_price', amountValue, [{ "currency": currency }])]
            );

            return resolve(quoteResponse);
        });
    }
}
