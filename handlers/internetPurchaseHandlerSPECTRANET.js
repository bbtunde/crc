const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PagaClient = require('./../services/pagaClient');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
const PagaRequestHandler=require('../pagaHelpers/pagaRequestHandler');
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
                      
                    }
        
                }
                else{
                    if(body.retry!=undefined)
                    {
                        amount=body.amount;
                    }
                    //use an initial random amount
                    amount="NGN_50"
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
            var purchaseHash = body.purchaseHash;
            var args = {
                referenceNumber:purchaseHash,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.customer_id,
                merchantService:[service]
            };
            var tohash=purchaseHash+amountValue+linetype+body.customer_id;
            if(body.retry!=undefined)
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
                
                if(body.service=="Renew")
                {
                   //get current plan amount
                    PagaClient.getSpectranetPlanDetails(linetype,body.customer_id)
                    .then(actualAmount=>
                    {
                        amountValue=actualAmount;
                        args.amount=amountValue
                        tohash=purchaseHash+amountValue+linetype+body.customer_id;
                        //make purchase from paga using overriden amount from paga
                        PagaRequestHandler.requestServicePurchase(serviceKey,args,tohash)
                        .then(purchaseResponse=>
                        {
                            return resolve(purchaseResponse);
                                
                        }) 
                        .catch(appError=>
                        {
                            return reject(appError);
                        });
                                
                    })
                    .catch(appError => {
                        return reject(appError);
                    });
                    
                }
                //user amount inputted by user
                else
                {
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

            }
            
                  
        });
    }
}
