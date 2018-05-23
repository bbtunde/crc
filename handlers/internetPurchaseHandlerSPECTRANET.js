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

    internetPurchaseHandlerSPECTRANET: (serviceKey, body) => {
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

            if (body.customer_id === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "customer_id" in body`, []));
            }
            if (body.service === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "service" in body`, []));
            }
            
            var amount;
            var service=body.service;
            if(configServiceData.has_cascade)
            {
                if(body.service==configServiceData.cascade_name)
                {
                    if (body.amount === undefined) {
                        return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
                    }
                    else{
                       amount=body.amount;
                      
                    }
        
                }
                else{
                    //use an initial random amount
                    amount="NGN_5000"
                }
                
            }

            try {
                if (!amount.includes("_")) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(amount);
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
            const generatedReference = `jone${Date.now()}`;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;        
            var args = {
                referenceNumber:generatedReference,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.customer_id,
                merchantService:[service]
            };
            var tohash=generatedReference+amountValue+linetype+body.customer_id;
            if(body.service=="Renew")
            {
                //get current plan amount
                PagaClient.getSpectranetPlanDetails(linetype,body.customer_id)
                    .then(actualAmount=>
                    {
                        amountValue=actualAmount;
                        args.amount=amountValue
                        tohash=generatedReference+amountValue+linetype+body.customer_id;
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
                        

                    })
                    .catch(appError => {
                        return reject(appError);
                    });
                    
            }
            else
            {
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
                                

            }
               
               
                
           
            
            
        });
    }
}
