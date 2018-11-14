const plansService = require('./../services/plansService');



/* istanbul ignore next */
module.exports = {

    formElementsPlansHandlerLEADWAY: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('LEADWAY', serviceKey)
                .then(options => {

                    formElement.elements[1].options = options;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }
}