const PaymentDetailItem = require('./../models/PaymentDetailItem');
var config = require('../config/config.json');
const QuoteResponse = require('./../models/QuoteResponse');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
const ParseUtils = require('./../services/parseUtils');
const availableServices = require('../config/requireServices').services;
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const AdditionalDetailItem = require('./../models/AdditionalDetailItem');
const PagaClient = require('./../services/pagaClient');
/* istanbul ignore next */
module.exports = {

    internetOrderSummaryHandlerSWIFT: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            // validate service configuration issues
            let configServiceData = {
                lynetype: null,
                service_key: null,
                destination: null,
                message_missing_destination: null,
                order_summary_needs_prevalidation: null
            };

            try {
                let data = servicesMapper.serviceDataByServiceKey(serviceKey);
                configServiceData.lynetype = data.lynetype;
                configServiceData.service_key = data.service_key;
                configServiceData.destination = data.destination;
                configServiceData.message_missing_destination = data.message_missing_destination;
                configServiceData.order_summary_needs_prevalidation = data.order_summary_needs_prevalidation;
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

            if (body.amount === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
            }

            try {
                if (!body.amount.includes("_")) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
                var amountValue = ParseUtils.parseMoneyAmountValue(body.amount);
                var currency = ParseUtils.parseMoneyCurrencyValue(body.amount);
                if (typeof amountValue != "number") {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
            }
            
          
            if (configServiceData.order_summary_needs_prevalidation) { // needs pre validation

               
                const generatedReference = `jone${Date.now()}`;
                const url = config.paga.business_endpoint+config.paga.merchant_account;
                
                const args = {
                    referenceNumber:generatedReference,
                    merchantAccount:linetype,
                    merchantReferenceNumber:body.customer_id,
                    merchantServiceProductCode:body.service
                };
               
                const tohash=generatedReference+linetype+body.customer_id+body.service;
                PagaClient.getSuccessMessage(url,args,tohash)
                    .then(result => {
                        try {
                            let customerName=result.customerName;
                            if(customerName===null)
                            {
                                let errorMessage = null;
                                try {
                                    errorMessage = getPrevalidationErrorMessage(serviceKey);
                                } catch (error) {
                                    errorMessage = 'Call to distributor resulted in error with provided order details.'
                                }

                                 let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                                reject(appError);
                            }
                            let additionalDetail = new AdditionalDetailItem('Customer Name', customerName);
                            let quoteResponse = new QuoteResponse(
                                availableServices[serviceKey].destination,
                                additionalDetail,
                                [new PaymentDetailItem('total_price', amountValue, [{ "currency": currency }])]
                            );
                            return resolve(quoteResponse);
                        } catch (error) {
                            console.log(error);
                            let errorMessage = null;
                            try {
                                errorMessage = getPrevalidationErrorMessage(serviceKey);
                            } catch (error) {
                                errorMessage = 'Call to distributor resulted in error with provided order details.'
                            }

                            let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                            reject(appError);
                        }
                    })
                    .catch(appError => {
                        return reject(appError);
                    });
            } else { // no need for pre validation
                
                let quoteResponse = new QuoteResponse(
                    availableServices[serviceKey].destination,
                    [],
                    [new PaymentDetailItem('total_price', amountValue, [{ "currency": currency }])]
                );

                return resolve(quoteResponse);
            }
        });
    }
}
