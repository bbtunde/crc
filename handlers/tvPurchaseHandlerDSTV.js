var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const PagaClient = require('./../services/pagaClient');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
/* istanbul ignore next */
module.exports = {

    tvPurchaseHandlerDSTV: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            let configServiceData = {
                lynetype: null,
                service_key: null,
                has_plans:null,
                has_cascade:null,
                cascade_name:null,
                
            };

            try {
                let data = servicesMapper.serviceDataByServiceKey(serviceKey);
                configServiceData.lynetype = data.lynetype;
                configServiceData.service_key = data.service_key;
                configServiceData.has_plans = data.has_plans;
                configServiceData.has_cascade = data.has_cascade;
                configServiceData.cascade_name = data.cascade_name;
        
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error in adapter. Config file from service "${serviceKey}" does not have defined all necessary fields.`, []));
            }
            try {
                var linetype = availableServices[serviceKey].definition.linetype;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Config file from service "${serviceKey}" must have set property "linetype" within root level object "definition".`, []));
            }

            if (body.smart_card_number === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "smart_card_number" in body`, []));
            }

            if (body.service === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "service" in body`, []));
            }

            
            var amount,service;
            if(configServiceData.has_cascade)
            {
                if(body.service==configServiceData.cascade_name)
                {
                   
                if (body.amount === undefined) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
                }
                else{
                   amount=body.amount;
                   let amount_service=body.service.split('.');
                   service=amount_service[1];
                }
    
                }
                else
                {
            
                    let amount_service=body.service.split('.');
                        amount=amount_service[0];
                        service=amount_service[1];
                }
            }

            try {
                if (!amount.includes("_")) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(amount);
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
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.smart_card_number,
                merchantService:[service]
            };
          
            const tohash=generatedReference+amountValue+linetype+body.smart_card_number;
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
