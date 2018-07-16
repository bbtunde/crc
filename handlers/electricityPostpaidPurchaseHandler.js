var config = require('../config/config.json');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PagaRequestHandler=require('../pagaHelpers/pagaRequestHandler');
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
             // validate purchaseHash
            if (body.purchaseHash === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "purchaseHash" in body`, []));
            }
            
            var purchaseHash=body.purchaseHash;
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            var service="Post Paid";
            
            var args = {
                referenceNumber:generatedReference,
                amount:amountValue,
                merchantAccount:linetype,
                merchantReferenceNumber:body.meter_number,
                merchantService:[service]
            };
            var tohash=generatedReference+amountValue+linetype+body.meter_number;
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
                        tohash=purchaseHash+amountValue+linetype+body.meter_number;
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
