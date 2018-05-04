const config = require('../config/config.json');
const plansService = require('./../services/plansService');
const availableServices = require('../config/requireServices').services;
const CacheService = require('./../services/cacheService');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

/* istanbul ignore next */
module.exports = {
    formElementsPlansHandlerSPECTRANET: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
    
            try {
                let options=formElement.elements[1].options;
                reFineOptions=pagaHelpers.addAmountFieldToOption("Refill",options);
                formElement.elements[1].options = reFineOptions;
                resolve(formElement)
                
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred retrieving plans', [])); 
            }
            
        });
    }
}
