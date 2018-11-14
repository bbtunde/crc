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
const plansService = require('./../services/plansService');
/* istanbul ignore next */


/*--get service destination---*/
const getDestinationValue = (matchingServiceKey, body) => {
    try {
        let mapper = servicesMapper.mapper;

        switch (matchingServiceKey) {

            case mapper.TV_PAGA_DSTV.service_key:
                return body[mapper.TV_PAGA_DSTV.destination];

            case mapper.TV_PAGA_GOTV.service_key:
                return body[mapper.TV_PAGA_GOTV.destination];

            case mapper.TV_PAGA_STARTIMES.service_key:
                return body[mapper.TV_PAGA_STARTIMES.destination];

            case mapper.TV_PAGA_MONTAGE.service_key:
                return body[mapper.TV_PAGA_MONTAGE.destination];

            case mapper.TV_PAGA_METRODIGITAL.service_key:
                return body[mapper.TV_PAGA_METRODIGITAL.destination];
        }

        throw new Error(`Destination value was not handled because there is no clause for key ${matchingServiceKey}`);
    } catch (error) {
        throw new Error(error.message);
    }
}


const getPrevalidationErrorMessage = (matchingServiceKey) => {
    try {
        let mapper = servicesMapper.mapper;

        switch (matchingServiceKey) {

            case mapper.TV_PAGA_DSTV.service_key:
                return mapper.TV_PAGA_DSTV.prevalidation_error_message;
            case mapper.TV_PAGA_GOTV.service_key:
                return mapper.TV_PAGA_GOTV.prevalidation_error_message;
            case mapper.TV_PAGA_STARTIMES.service_key:
                return mapper.TV_PAGA_STARTIMES.prevalidation_error_message;
            case mapper.TV_PAGA_MONTAGE.service_key:
                return mapper.TV_PAGA_MONTAGE.prevalidation_error_message;
            case mapper.TV_PAGA_METRODIGITAL.service_key:
                return mapper.TV_PAGA_METRODIGITAL.prevalidation_error_message;


        }
        throw new Error(`Pre Validation error message was not handled because there is no clause for key ${matchingServiceKey}`);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {

    tvOrderSummaryHandler: (serviceKey, body) => {
        return new Promise(function (resolve, reject) {
            // validate service configuration issues
            let configServiceData = {
                lynetype: null,
                service_key: null,
                has_plans: null,
                has_cascade: null,
                cascade_name: null,
                destination: null,
                message_missing_destination: null,
                order_summary_needs_prevalidation: null
            };

            try {
                let data = servicesMapper.serviceDataByServiceKey(serviceKey);
                configServiceData.lynetype = data.lynetype;
                configServiceData.service_key = data.service_key;
                configServiceData.has_plans = data.has_plans;
                configServiceData.has_cascade = data.has_cascade;
                configServiceData.cascade_name = data.cascade_name;
                configServiceData.destination = data.destination;
                configServiceData.message_missing_destination = data.message_missing_destination;
                configServiceData.order_summary_needs_prevalidation = data.order_summary_needs_prevalidation;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error in adapter. Config file from service "${serviceKey}" does not have defined all necessary fields.`, []));
            }

            try {
                var linetype = availableServices[serviceKey].definition.linetype;
                var serviceName = availableServices[serviceKey].definition.service_name;
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Config file from service "${serviceKey}" must have set property "linetype" and "service_name" within root level object "definition".`, []));
            }

            //check if destination is present in body 
            let destination = configServiceData.destination;
            if (body[destination] === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "${destination}" in body`, []));
            }

            // get destination reference
            try {
                var destinationRef = getDestinationValue(serviceKey, body);
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error getting destination.`, []));
            }

            if (body.service === undefined) {
                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "service" in body`, []));
            }
            plansService.plansHandler(serviceName, serviceKey)
                .then(options => {
                    let exist = options.find(option => option.option_value == body.service)
                    if (exist === undefined) {
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'This plan is no more available, kindly initiate a new transaction', []));
                    }

                    var amount, service;
                    if (configServiceData.has_cascade) {
                        if (body.service == configServiceData.cascade_name) {

                            if (body.amount === undefined) {
                                return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Missing "amount" in body`, []));
                            }
                            else {
                                amount = body.amount;
                                let amount_service = body.service.split('/');
                                service = amount_service[1];
                            }

                        }
                        else {

                            let amount_service = body.service.split('/');
                            amount = amount_service[0];
                            service = amount_service[1];
                        }
                    }
                    else {
                        let amount_service = body.service.split('/');
                        amount = amount_service[0];
                        service = amount_service[1];

                    }


                    try {
                        if (!amount.includes("_")) {
                            return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                        }
                        var amountValue = ParseUtils.parseMoneyAmountValue(amount);
                        var currency = ParseUtils.parseMoneyCurrencyValue(amount);
                        if (typeof amountValue != "number") {
                            return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Amount is not properly formatted. It should be like: NGN_100`, []));
                        }
                    } catch (error) {

                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error parsing amount from body', []));
                    }


                    if (configServiceData.order_summary_needs_prevalidation) { // needs pre validation


                        const generatedReference = `jone${Date.now()}`;
                        const url = config.paga.business_endpoint + config.paga.merchant_account;

                        const args = {
                            referenceNumber: generatedReference,
                            merchantAccount: linetype,
                            merchantReferenceNumber: destinationRef,
                            merchantServiceProductCode: service
                        };


                        const tohash = generatedReference + linetype + destinationRef + service;

                        PagaClient.getSuccessMessage(url, args, tohash)
                            .then(result => {
                                try {
                                    let customerName = result.customerName;
                                    if (customerName === null) {
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
                                        [additionalDetail],
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
                                if (appError.response == "Merchant account not found.") {
                                    let errorMessage = null;
                                    try {
                                        errorMessage = getPrevalidationErrorMessage(serviceKey);
                                    } catch (error) {
                                        errorMessage = 'Call to distributor resulted in error with provided order details.'
                                    }

                                    let appError = new AppError(400, 'PREVALIDATION_FAILED', errorMessage, []);
                                    reject(appError);

                                }
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


                })
                .catch(error => reject(error));


        });
    }
}
