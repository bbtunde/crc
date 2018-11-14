
const plansService = require('./../services/plansService');

/* istanbul ignore next */
module.exports = {

    formElementsPlansHandlerMETRODIGITAL: (formElement, serviceKey, body) => {
        return new Promise((resolve, reject) => {
            plansService.plansHandler('METRODIGITAL', serviceKey)
                .then(options => {

                    formElement.elements[1].options = options;
                    resolve(formElement);
                })
                .catch(error => reject(error)
                );
        });
    }
}
