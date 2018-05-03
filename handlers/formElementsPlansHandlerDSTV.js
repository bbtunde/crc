const config = require('../config/config.json');
const plansService = require('./../services/plansService');
const availableServices = require('../config/requireServices').services;
const CacheService = require('./../services/cacheService');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

/* istanbul ignore next */
module.exports = {
    formElementsPlansHandlerDSTV: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            if(config.couchbase && config.couchbase.enabled) {
                try {
                    let linetype=availableServices[serviceKey].definition.linetype;
                    CacheService.get('DSTV', (cachedPlans) => {
                        if (!cachedPlans) {
                            plansService.getOptionsAndCachePlans('DSTV', linetype)
                                .then(options => {
                                    reFineOptions=pagaHelpers.addAmountFieldToOption("Box Office",options);
                                    formElement.elements[1].options = reFineOptions;
                                    resolve(formElement)
                                })
                                .catch(appError => reject(appError));
                        } else {
                            try {
                                let options = plansService.parsePlansToOptions(cachedPlans);
                                reFineOptions=pagaHelpers.addAmountFieldToOption("Box Office",options);
                                formElement.elements[1].options = reFineOptions;
                                resolve(formElement);
                             } catch (error) {
                                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred on parsing plans to options', [])); 
                             }
                        }
                    });
                } catch (error) {
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred retrieving plans', [])); 
                }
            } else {
                plansService.getPlans('DSTV', linetype)
                .then(plans => {
                    try {
                        let options = plansService.parsePlansToOptions(plans);
                        reFineOptions=pagaHelpers.addAmountFieldToOption("Box Office",options);
                        formElement.elements[1].options = reFineOptions;
                        resolve(formElement);
                    } catch (error) {
                        return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred on parsing plans to options', [])); 
                    }
                })
                .catch(err => {
                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error retrieving plans', [])); 
                });
            }
        });
    }
}
