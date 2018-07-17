const request=require('request');
const crypto=require('crypto');
const config = require('../config/config.json');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');

module.exports = class pagaClient {

    static isSuccessResponse(response) {
        if ((response.responseCode == undefined) || (response.responseCode == undefined)) {
            return false;
        }

        if ((response.responseCode == 0) || (response.responseCode == "0")) {
            return true;
        }

        return false;
    }

    /* istanbul ignore next */
    static getSuccessMessage(url,args,tohash) {
        var pagaClient = this;
        return new Promise((resolve, reject) => {
            
            const sha512 = crypto.createHash('sha512');
            tohash=tohash+config.paga.hashkey;
            var hash= sha512.update(tohash).digest('hex');

            request.post({
                url: url,
                headers:{
                    'principal':config.paga.principal,
                    'credentials':config.paga.credentials,
                    'hash':hash,
                    'Content-Type':'application/json'
                },
                body: args,
                json:true,
            }, function(error, response, body){
             
                if (response.statusCode === 200) {
                   
                    if (pagaClient.isSuccessResponse(body)) {
                        return resolve(body);
                    } else {
                        return reject(pagaClient.getAppErrorMessage(body,error));
                    }

                } else {
                    
                    return reject(pagaClient.getAppErrorMessage(body,error));
                }
            });

        });
    };
    /*---get customer current spectranet plan details---*/
      
    static getSpectranetPlanDetails(linetype,customer_id) {
        
        var pagaClient = this;
        return new Promise(function (resolve, reject) {

            const generatedReference = `jone${Date.now()}`;
            let amountValue=50
            const url = config.paga.business_endpoint+config.paga.validate_merchant_payment;
            const args = {
                referenceNumber:generatedReference,
                merchantAccount:linetype,
                amount:amountValue,
                merchantReferenceNumber:customer_id,
                merchantServiceProductCode:"RENEW"
            };
            
           const tohash=generatedReference+amountValue+linetype+customer_id
                
    
           pagaClient.getSuccessMessage(url,args,tohash)
                .then(result => {
                    
                    try {
                        let amount=result.overrideAmount
                        if(amount!=undefined && amount!=null)
                        {
                            return resolve(amount);
                        }
                        let errorMessage = 'Problem getting customer current plan details'
                        let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                        reject(appError);
                        

                    } catch (error) {
                        let errorMessage = 'Problem getting customer current plan details'
                        let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                        reject(appError);
                    }
                })
                .catch(error => {
                    
                    let appError = new AppError(400, 'PREVALIDATION_FAILED', error, []);
                    return reject(appError);
                });
               
            });
    }

    /*----get error message from paga response body and error--*/
    static getAppErrorMessage(body,error)
    {
        let errorMessage=error;
            if(body.errorMessage!=undefined)
            {
                errorMessage=body.errorMessage
            }
            else if(body.message!=undefined)
            {
                errorMessage=body.message;
            }
        
            return new AppError(500, ResponseCode.SERVICE_TEMPORARILY_UNAVAILABLE,errorMessage , []);
            
    }
}
