const plansService = require('./../services/plansService');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

/* istanbul ignore next */
module.exports = {

    formElementsPlansHandlerSPECTRANET: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('SPECTRANET', serviceKey)
                .then(options => {
                    // Copy Object by reference so it doesn't add infinitely the field
                    let _formElement = JSON.parse(JSON.stringify(formElement));
                    let reFinedOptions = pagaHelpers.addAmountFieldToOption("Refill", _formElement.elements[_formElement.elements.length - 1].options);
                    _formElement.elements[_formElement.elements.length - 1].options = reFinedOptions;
                    resolve(_formElement);
                })
                .catch(error => reject(error)
                );
        });
    }
}
