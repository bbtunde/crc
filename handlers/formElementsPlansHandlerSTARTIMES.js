const plansService = require('./../services/plansService');

/* istanbul ignore next */
module.exports = {


    formElementsPlansHandlerSTARTIMES: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('STARTIMES', serviceKey)
                .then(options => {

                    formElement.elements[1].options = options;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }

}
