const plansService = require('./../services/plansService');
const pagaHelpers = require('./../pagaHelpers/pagaHelpers');


/* istanbul ignore next */

module.exports = {
    formElementsPlansHandlerSMILE: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('SMILE', serviceKey)
                .then(options => {
     
                    let reFinedOptions=pagaHelpers.addAmountFieldToOption("NGN_.Buy Airtime",options);
                    formElement.elements[1].options = reFinedOptions;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }
}
