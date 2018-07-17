var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const PagaClient = require('./../services/pagaClient');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
const PagaRequestHandler=require('../pagaHelpers/pagaRequestHandler');
/* istanbul ignore next */
module.exports = {

    internetPurchaseHandlerSMILE: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
             // validate service configuration issues
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
             // validate purchaseHash
             if (body.purchaseHash === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "purchaseHash" in body`, []));
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
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_1000.2GB MidNite Pla`, []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(amount);
                if (typeof amountValue != "number") {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_1000.2GB MidNite Pla`, []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
            
            var purchaseHash = body.purchaseHash;
            var args = {
                referenceNumber:purchaseHash,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.customer_id,
                merchantService:[service]
            };
            var tohash=purchaseHash+amountValue+linetype+body.customer_id;
            if(body.retry)
            {
                //check status before attempt to make new purchase
                PagaRequestHandler.requestTransactionQuery(purchaseHash)
               .then(result=>
                {
                    //prepare response
                  let purchaseResponse= PagaRequestHandler.getPurchaseResponse(serviceKey, result);
                  if(purchaseResponse instanceof AppError)
                  {
                      return reject(purchaseResponse);
                  }
                  return resolve(purchaseResponse);

                })
                .catch(appError=>
                {
            
                    //inital purchase failed, initiate fresh
                    if(appError.response=="FAILED")
                    {
                        purchaseHash=`jone${Date.now()}`;
                        args.referenceNumber=purchaseHash;
                        tohash=purchaseHash+amountValue+linetype+body.customer_id;
                        PagaRequestHandler.requestServicePurchase(serviceKey,args,tohash)
                        .then(purchaseResponse=>
                        {
                            return resolve(purchaseResponse);
                            
                        }) 
                        .catch(appError=>
                        {
                            return reject(appError);
                        });
                    }
                    //transaction not found or status is pending
                    return reject(appError);
  
                 
                });
            }
            else{

                PagaRequestHandler.requestServicePurchase(serviceKey,args,tohash)
                    .then(purchaseResponse=>
                    {
                        return resolve(purchaseResponse);
                        
                    }) 
                    .catch(appError=>
                    {
                        return reject(appError);
                    });
            }
        });
    }
}
