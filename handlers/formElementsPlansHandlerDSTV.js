const plansService = require('./../services/plansService');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');

/* istanbul ignore next */
module.exports = {

    formElementsPlansHandlerDSTV: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('DSTV', serviceKey)
                .then(options => {
                    let reFinedOptions = pagaHelpers.addAmountFieldToOption("NGN_.Box Office", options);
                    formElement.elements[1].options = reFinedOptions;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }

}
