var config = require('../config/config.json');
const PagaClient = require('./../services/pagaClient');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const PurchaseResponse = require('./../models/PurchaseResponse');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

module.exports = class pagaRequestHandler {


    /*---build purchase response from paga responseObject--*/

    static getPurchaseResponse(serviceKey, result, generatedReference) {
        try {
            let transactionReference = (undefined == result.transactionId) ? null : result.transactionId;
            let extraInfo = availableServices[serviceKey].extra_info ? pagaHelpers.getMeterTokenExtraInfo(result) : '';
            if (availableServices[serviceKey].extra_info) {
                if (extraInfo == "" || extraInfo == undefined) {
                    return new AppError(500, ResponseCode.UNKNOWN_ERROR, `Empty  extra info (token) returned by Paga`, [{ generatedReference }]);
                }

            }
            let purchaseResponse = new PurchaseResponse(transactionReference, result, extraInfo, generatedReference);
            return purchaseResponse;
        } catch (error) {
            return new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error building purchase response from successfull purchase request to Paga`, [{ generatedReference }]);
        }
    }


    // to requery paga api for previously completed transaction
    static requestTransactionQuery(generatedReference) {
        return new Promise(function (resolve, reject) {

            const url = config.paga.merchant_endpoint + config.paga.get_transaction;
            const args =
            {
                "merchantReference": generatedReference
            };
            const tohash = generatedReference;
            PagaClient.getSuccessMessage(url, args, tohash)
                .then(result => {

                    try {
                        if (result.status == "SUCCESSFUL") {
                            return resolve(result);
                        }
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, result.status, [{ generatedReference }]));


                    } catch (error) {
                        let errorMessage = result.errorMessage === undefined ? error : result.errorMessage;
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, errorMessage, [{ generatedReference }]));
                    }
                })
                .catch(appError => {
                    appError.extraInfo = [{ generatedReference }];
                    return reject(appError);
                });


        });
    }


    //make purchase a particular service and get the value
    static requestServicePurchase(serviceKey, args, tohash) {
        var requestHandler = this;
        return new Promise(function (resolve, reject) {
            const url = config.paga.business_endpoint + config.paga.merchant_payment;
            PagaClient.getSuccessMessage(url, args, tohash)
                .then(result => {
                    let purchaseResponse = requestHandler.getPurchaseResponse(serviceKey, result, args.referenceNumber);
                    if (purchaseResponse instanceof AppError) {
                        return reject(purchaseResponse);
                    }
                    return resolve(purchaseResponse);

                })
                .catch(_appError => {
        
                    //check transaction status on distributor api b4 sending failed response
                    requestHandler.requestTransactionQuery(args.referenceNumber)
                        .then(result => {

                            let purchaseResponse = requestHandler.getPurchaseResponse(serviceKey, result, args.referenceNumber);
                            if (purchaseResponse instanceof AppError) {
                                return reject(_appError);
                            }
                            //initial transaction was successful, send success reponse 
                            return resolve(purchaseResponse);
                        })
                        .catch(appError => {
                            //set the reason to initial failed reason not the status checked reason
                            appError.response = _appError.response;
                            return reject(appError);
                        });


                });
        });

    }


}

