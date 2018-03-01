var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const PagaClient = require('./../services/pagaClient');
/* istanbul ignore next */
module.exports = {

    internetPurchaseHandlerSWIFT: (serviceKey, body) => {
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
            
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
            amountValue= amountValue.toFixed(2)
            const generatedReference = `jone${Date.now()}`;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            
            const args = {
                referenceNumber:generatedReference,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.customer_id,
                merchantService:"Data"
            };
            const tohash=generatedReference+amountValue+linetype+body.customer_id;
            PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
                try {
                    let transactionReference = (undefined == result.transactionId) ? null : result.transactionId;
                    let purchaseResponse = new PurchaseResponse(transactionReference, result, '');
                    return resolve(purchaseResponse);
                } catch (error) {
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error building purchase response from successfull purchase request to Paga`, []));
                }
            })
            .catch(appError => {
                return reject(appError);
            });
        });
    }
}
