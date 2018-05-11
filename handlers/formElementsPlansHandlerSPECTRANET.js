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
                // Copy Object by reference so it doesn't add infinitely the field
                let _formElement = JSON.parse(JSON.stringify(formElement));
                reFineOptions=pagaHelpers.addAmountFieldToOption("Refill",_formElement.elements[_formElement.elements.length-1].options);
                _formElement.elements[_formElement.elements.length-1].options = reFineOptions;
                resolve(_formElement)
                
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error ocurred retrieving plans', [])); 
            }
            
        });
    }
}
