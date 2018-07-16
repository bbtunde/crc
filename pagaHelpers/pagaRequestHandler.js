var config = require('../config/config.json');
const PagaClient = require('./../services/pagaClient');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

module.exports = class pagaRequestHandler {


    /*---build purchase response from paga responseObject--*/
        
    static getPurchaseResponse(serviceKey, result)
    {
        try {
            let transactionReference = (undefined == result.transactionId) ? null : result.transactionId;
            let extraInfo = availableServices[serviceKey].extra_info ? pagaHelpers.getMeterTokenExtraInfo(result) : '';
            if(availableServices[serviceKey].extra_info)
            {
                if(extraInfo==""||extraInfo==undefined)
                {
                    return new AppError(500, ResponseCode.UNKNOWN_ERROR, `Empty  extra info(token) returned by Paga`, []);
                }
            }
            let purchaseResponse = new PurchaseResponse(transactionReference, result, extraInfo);
            return purchaseResponse;
        } catch (error) {
            
            return new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error building purchase response from successfull purchase request to Paga`, []);
        }
        

    }

    
    // to requery paga api for previously completed transaction
    static requestTransactionQuery(referenceNumber) {
        return new Promise(function (resolve, reject) {

            const url = config.paga.merchant_endpoint + config.paga.get_transaction;
            const args =
            {
                "merchantReference": referenceNumber
            };
            const tohash=referenceNumber;
            PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
              
                try {
                    if(result.status=="SUCCESSFUL")
                    {
                        return resolve(result);
                    }
                    //Initial transaction failed, so retry
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, result.status, []));

                   
                } catch (error) {
                    let errorMessage=result.errorMessage===undefined ? error:result.errorMessage;
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, errorMessage, []));
                }
            })
            .catch(appError => {

                return reject(appError);
            });

           
        });
    }  


    //make purchase a particular service and get the value
    static requestServicePurchase(servicekey,args,tohash) {
        var requestHandler=this;
        return new Promise(function (resolve, reject) {
            const url = config.paga.business_endpoint+config.paga.merchant_payment;
            PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
                let purchaseResponse= requestHandler.getPurchaseResponse(servicekey, result);
                if(purchaseResponse instanceof AppError)
                {
                    return reject(appError);
                }
                 return resolve(purchaseResponse);

            })
            .catch(appError => {
              return  reject(appError);
            });
        });
       
    }
    
    
}

