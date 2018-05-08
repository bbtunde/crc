const config = require('../config/config.json');
const cacheService = require('./cacheService');
const Option = require('./../models/Option');
const PagaClient = require('./pagaClient');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');


var getPlans = (linetype) => {
    return new Promise((resolve, reject) => {
        const url = config.paga.business_endpoint+config.paga.merchant_service;
        const generatedReference = `jone${Date.now()}`;
        const args = {
            referenceNumber:generatedReference,
            merchantPublicId:linetype         
        };
        const tohash=generatedReference+args.merchantPublicId;
        PagaClient.getSuccessMessage(url,args,tohash)
            .then(result => {
                
                return resolve(result.services);

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
            let option = new Option(
                                    plans[i].name, 
                                    "", 
                                    `NGN_${plans[i].price}.${plans[i].name}`, 
                                    `NGN ${plans[i].price}`, 
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

/* istanbul ignore next */
var getOptionsAndCachePlans = (key,linetype) => {
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
