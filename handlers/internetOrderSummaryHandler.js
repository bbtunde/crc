const availableServices = require('../config/requireServices').services;
const QuoteResponse = require('./../models/QuoteResponse');
const AdditionalDetailItem = require('./../models/AdditionalDetailItem');
const ParseUtils = require('../services/parseUtils');
const config = require('../config/config.json');
const servicesMapper = require('./../pagaHelpers/servicesMapper');
const PaymentDetailItem = require('./../models/PaymentDetailItem');
const AppError = require('./../models/AppError');
const PagaClient = require('./../services/pagaClient');
const ResponseCode = require('./../models/ResponseCode');
const fee=105;

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
const getDestinationValue = (matchingServiceKey, body) => {
    try {
        let mapper = servicesMapper.mapper;

        switch (matchingServiceKey) {
           
            case mapper.INTERNET_PAGA_SPECTRANET.service_key:
                return body[mapper.INTERNET_PAGA_SPECTRANET.destination];
            case mapper.INTERNET_PAGA_SWIFT.service_key:
               return body[mapper.INTERNET_PAGA_SWIFT.destination];
            case mapper.INTERNET_PAGA_SMILE.service_key:
                return body[mapper.INTERNET_PAGA_SMILE.destination];
        }

        throw new Error(`Destination value was not handled because there is no clause for key ${matchingServiceKey}`);
    } catch (error) {
        throw new Error(error.message);
    }
}

/* istanbul ignore next */
const getPrevalidationErrorMessage = (matchingServiceKey) => {
    try {
        let mapper = servicesMapper.mapper;

        switch (matchingServiceKey) {
            
            case mapper.INTERNET_PAGA_SPECTRANET.service_key:
                return mapper.INTERNET_PAGA_SPECTRANET.prevalidation_error_message;
            case mapper.INTERNET_PAGA_SWIFT.service_key:
                return mapper.INTERNET_PAGA_SWIFT.prevalidation_error_message;
            case mapper.INTERNET_PAGA_SMILE.service_key:
                return mapper.INTERNET_PAGA_SMILE.prevalidation_error_message;
        }
        throw new Error(`Pre Validation error message was not handled because there is no clause for key ${matchingServiceKey}`);
    } catch (error) {
        throw new Error(error.message);
    }
}

/* istanbul ignore next */
module.exports = {

    internetOrderSummaryHandler: (serviceKey, body) => {
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

                if (!isValidLineType(linetype, serviceKey)) {
                    return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Provided service key "${serviceKey}" and linetype "${linetype}" don't match according to adapter config file.`, []));
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error in adapter. Config file from service "${serviceKey}" does not have any "linetype" matching provided service key.`, []));
            }

            // get destination reference
            try {
                var destinationRef = getDestinationValue(serviceKey, body);
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error getting destination.`, []));
            }

            // validate amount
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

            // request pre validation to distributor if needed 
            if (configServiceData.order_summary_needs_prevalidation) { // needs pre validation

               
                const generatedReference = `jone${Date.now()}`;
                const url = config.paga.business_endpoint+config.paga.merchant_payment;
                let amount=0;
                amount=amount.toFixed(2);
                const args = {
                    referenceNumber:generatedReference,
                    amount:amount,
                    merchantAccount:linetype,
                    merchantReferenceNumber:destinationRef
                };

                const tohash=generatedReference+amount+linetype+destinationRef;
                PagaClient.getSuccessMessage(url,args,tohash)
                    .then(result => {
                        try {
                            let quoteResponse = new QuoteResponse(
                                availableServices[serviceKey].destination,
                                [],
                                [new PaymentDetailItem('total_price', amountValue, [{ "currency": currency }])]
                            );
                            return resolve(quoteResponse);
                        } catch (error) {
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

                let total_amount=amountValue+fee;
                let quoteResponse = new QuoteResponse(
                    availableServices[serviceKey].destination,
                    [],
                    [new PaymentDetailItem('total_price', total_amount, [{ "currency": currency,"fee":fee,"amount":amountValue }])]
                );

                return resolve(quoteResponse);
            }
        });
    }
}
