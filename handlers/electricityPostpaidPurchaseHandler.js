var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const PagaClient = require('./../services/pagaClient');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');
/* istanbul ignore next */
module.exports = {

    electricityPostpaidPurchaseHandler: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            try {
                var linetype = availableServices[serviceKey].definition.linetype;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Config file from service "${serviceKey}" must have set property "linetype" within root level object "definition".`, []));
            }

            if (body.meter_number === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "meter_number" in body`, []));
            }

            if (body.meter_number === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "meter_number" in body`, []));
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
            
            const generatedReference = `jone${Date.now()}`;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            var service="Post Paid";
            
            const args = {
                referenceNumber:generatedReference,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.meter_number,
                merchantService:[service]
            };
            const tohash=generatedReference+amountValue+linetype+body.meter_number;
            PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
                try {
                    let transactionReference = (undefined == result.transactionId) ? null : result.transactionId;
                    let extraInfo= pagaHelpers.getMeterTokenExtraInfo(result);
                    let purchaseResponse = new PurchaseResponse(transactionReference, result, extraInfo);
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
