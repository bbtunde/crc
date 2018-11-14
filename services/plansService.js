const config = require('../config/config.json');
const cacheService = require('./cacheService');
const Option = require('./../models/Option');
const PagaClient = require('./pagaClient');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const availableServices = require('../config/requireServices').services;

var getPlans = (linetype) => {
    return new Promise((resolve, reject) => {
        const url = config.paga.business_endpoint + config.paga.merchant_service;
        const generatedReference = `jone${Date.now()}`;
        const args = {
            referenceNumber: generatedReference,
            merchantPublicId: linetype
        };
        const tohash = generatedReference + args.merchantPublicId;
        PagaClient.getSuccessMessage(url, args, tohash)
            .then(result => {
                let services = result.services;
                return resolve(services.sort(sortPlansByPrice));

            })
            .catch(appError => {
                return reject(appError);
            });
    });
};

var parsePlansToOptions = (plans) => {
    try {
        let options = [];
        for (let i = 0; i < plans.length; i++) {
            let price = plans[i].price;
            if (price == 0) {
                price = "";
            }
            let option = new Option(
                plans[i].name,
                "",
                `NGN_${plans[i].price}/${plans[i].name}`,
                `NGN ${price}`,
                "",
                false,
                []);
            options.push(option);
        }

        return options;
    } catch (error) {
        throw new Error('Error parsing plans to options');
    }
}

var sortPlansByPrice = (a, b) => {
    return a.price - b.price
}

var plansHandler = (key, serviceKey) => {
    return new Promise((resolve, reject) => {
        let linetype = availableServices[serviceKey].definition.linetype;
        if (config.couchbase && config.couchbase.enabled) {
            try {
                cacheService.get(key, (cachedPlans) => {
                    if (!cachedPlans) {
                        getOptionsAndCachePlans(key, linetype)
                            .then(options => {
                                resolve(options)
                            })
                            .catch(appError => { reject(appError) });
                    } else {
                        try {
                            parsePlansToOptions(cachedPlans)
                                .then(options => {
                                    resolve(options)
                                })
                                .catch(appError => reject(appError))
                        } catch (error) {
                            return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred on parsing plans to options', []));
                        }
                    }
                });
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred retrieving plans', []));
            }
        } else {
            getPlans()
                .then(plans => {
                    try {
                        parsePlansToOptions(plans)
                            .then(options => {
                                resolve(options);
                            })
                            .catch(appError => {
                                reject(appError)
                            })
                    } catch (error) {
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred on parsing plans to options', []));
                    }
                })
                .catch(err => {
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error retrieving plans${err}`, []));
                });
        }
    });
}

/* istanbul ignore next */
var getOptionsAndCachePlans = (key, linetype) => {
    return new Promise((resolve, reject) => {
        getPlans(linetype)
            .then(plans => {
                try {
                    if (config.couchbase && config.couchbase.enabled) {
                        cacheService.set(key, plans);
                    } else {
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Configuration file has not enabled couchbase. It's not possible to cache plans`, []));
                    }

                    let options = parsePlansToOptions(plans);

                    resolve(options);
                } catch (error) {
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred on caching and parsing plans to options', []));
                }
            })
            .catch(appError => {
                reject(appError);
            });
    });
}

module.exports.getPlans = getPlans;
module.exports.getOptionsAndCachePlans = getOptionsAndCachePlans;
module.exports.parsePlansToOptions = parsePlansToOptions;
module.exports.plansHandler = plansHandler;
