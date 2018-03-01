const PaymentDetailItem = require('./../models/PaymentDetailItem');
var config = require('../config/config.json');
const QuoteResponse = require('./../models/QuoteResponse');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PagaClient = require('./../services/pagaClient');
/* istanbul ignore next */
module.exports = {

    internetOrderSummaryHandlerSWIFT: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            try {
                var linetype = availableServices[serviceKey].definition.linetype;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Config file from service "${serviceKey}" must have set property "linetype" within root level object "definition".`, []));
            }

            if (body.customer_id === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "customer_id" in body`, []));
            }

            if (body.amount === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
            }

            try {
                if (!body.amount.includes("_")) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(body.amount);
                var currency = ParseUtils.parseMoneyCurrencyValue(body.amount);
                if (typeof amountValue != "number") {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
            const generatedReference = `jone${Date.now()}`;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            const args = {
                referenceNumber:generatedReference,
                amount:0.00,
                merchantAccount:linetype,
                merchantReferenceNumber:body.customer_id
            };
           
            const tohash=generatedReference+args.amount+linetype+body.customer_id;
            PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
                try {
                        let fee=config.paga.service_fee;
                        let total_amount=amountValue+fee;
                        let quoteResponse = new QuoteResponse(
                            availableServices[serviceKey].destination,
                            [],
                            [new PaymentDetailItem('total_price', total_amount, [{ "currency": currency,"fee":fee,"amount":amountValue }])]
                        );
                        return resolve(quoteResponse);
                } catch (error) {
                    let errorMessage = null;
                    try {
                        errorMessage = 'Please make sure your customer ID is correct. ' +
                        'Otherwise, please check your account status with your operator.';
                    } catch (error) {
                        errorMessage = 'Call to distributor resulted in error with provided order details.'
                    }

                    let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                    reject(appError);
                }
            })
            .catch(appError => {
                return reject(appError);
            });
 
        });
    }
}
