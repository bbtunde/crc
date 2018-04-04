const availableServices = require('../config/requireServices').services;
var ParseUtils = require('../services/parseUtils');
var config = require('../config/config.json');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
const PagaClient = require('./../services/pagaClient');;
const PurchaseResponse = require('./../models/PurchaseResponse');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');

/* istanbul ignore next */
const isValidLineType = (linetypeToValidate, matchingServiceKey) => {
    try {
        let serviceData = servicesMapper.serviceDataByServiceKey(matchingServiceKey);

        return (serviceData.lynetype == linetypeToValidate);
    } catch (error) {
        return false;
    }
}

/* istanbul ignore next */
const isValidDestination = (destinationToValidate, matchingServiceKey) => {
    try {
        let serviceData = servicesMapper.serviceDataByServiceKey(matchingServiceKey);

        return (serviceData.destination == destinationToValidate);
    } catch (error) {
        return false;
    }
}

/* istanbul ignore next */
module.exports = {

    purchaseHandler: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {

            // validate service configuration issues
            let configServiceData = {
                lynetype: null,
                service_key: null,
                destination: null,
                message_missing_destination: null,
            };

            try {
                let data = servicesMapper.serviceDataByServiceKey(serviceKey);
                configServiceData.lynetype = data.lynetype;
                configServiceData.service_key = data.service_key;
                configServiceData.destination = data.destination;
                configServiceData.message_missing_destination = data.message_missing_destination;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error in adapter. Config file from service "${serviceKey}" does not have defined all necessary fields.`, []));
            }

            try {
                var linetype = availableServices[serviceKey].definition.linetype;

                if (!isValidLineType(linetype, serviceKey)) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Provided service key "${serviceKey}" and linetype "${linetype}" don't match according to adapter config file.`, []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error in adapter. Config file from service "${serviceKey}" does not have any "linetype" matching provided service key.`, []));
            }

            // validate destination
            if (body[configServiceData.destination] === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, serviceData.message_missing_destination, []));
            }

            // validate amount
            if (body.amount === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
            }

            try {
                let amount = body['amount'];
                var plan=[];
                if(configServiceData.has_plans)
                {
                    let amount_plan=amount.split('.');
                    amount=amount_plan[0];
                    plan.push(amount_plan[1]);
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(amount);
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
    
            
            // request purchase distributor
            const generatedReference = `jone${Date.now()}`;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            const destinationRef=body[configServiceData.destination];
            const args = {
                referenceNumber:generatedReference,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:destinationRef,
                merchantService:plan
            };
            const tohash=generatedReference+amountValue+linetype+destinationRef;
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
