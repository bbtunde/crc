const plansService = require('./../services/plansService');

/* istanbul ignore next */
module.exports = {

    formElementsPlansHandlerGOTV: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('GOTV', serviceKey)
                .then(options => {

                    formElement.elements[1].options = options;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }

}
