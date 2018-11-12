var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PagaRequestHandler = require('../pagaHelpers/pagaRequestHandler');
/* istanbul ignore next */
module.exports = {

    electricityPrepaidPurchaseHandler: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            try {
                var linetype = availableServices[serviceKey].definition.linetype;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Config file from service "${serviceKey}" must have set property "linetype" within root level object "definition".`, []));
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
            let service = ["Pre Paid"],
            merchantReferenceNumber = body.meter_number;

            if (serviceKey == "electricity.prepaid.abuja") {
                service = [];
                //max 11 digits for abuja(allow user to enter more than 11)
                merchantReferenceNumber = merchantReferenceNumber.substr(0, 11);
            }

            const args = {
                referenceNumber: generatedReference,
                amount: amountValue.toString(),
                merchantAccount: linetype,
                merchantReferenceNumber: merchantReferenceNumber,
                merchantService: service
            };
            const tohash = generatedReference + amountValue + linetype + merchantReferenceNumber;
            PagaRequestHandler.requestServicePurchase(serviceKey, args, tohash)
                .then(purchaseResponse => {
                    return resolve(purchaseResponse);

                })
                .catch(appError => {

                    return reject(appError);
                });

        });
    }
}
