const Validators = require('./../models/Validators');
const AppError = require('./../models/AppError');
const RequestHandlers = require('./../config/requireHandlers').handlers;
const availableServices = require('./../config/requireServices').services;
const FormElementFactory = require('./formElementsFactory');
const ResponseCode = require('./../models/ResponseCode');

module.exports = class FormService {

    /**
     *
     * @param serviceKey
     * @param body
     * @returns object
     */
    static validateAndGetNextStep(serviceKey, body) {
        /**
         * Find first step with missing fields. It's the one must be delivered.
         */
        let nextStep = null;
        let stepIndex = 1;
        let validationStatus = true;
        let errorsFound = [];
        for (var i = 0, len = availableServices[serviceKey].steps.length; i < len; i++) {
            let step = availableServices[serviceKey].steps[i];
            for (var j = 0, lenj = step.fields.length; j < lenj; j++) {
                let field = step.fields[j];
                if (!body[field.key]) {
                    nextStep = step;
                    errorsFound.push(
                        {
                            property: field.key,
                            message: 'Missing field'
                        }
                    );
                }
            }

            if (nextStep !== null || errorsFound.length > 0) {
                break;
            }

            stepIndex++;
        }

        return {
            isLast: nextStep === null,
            currentStep: errorsFound.length > 0 ? stepIndex : stepIndex - 1,
            fields: nextStep != null ? nextStep.fields : [],
            stepCount: availableServices[serviceKey].steps.length,
            requestHandler: nextStep != null && nextStep.requestHandler ? nextStep.requestHandler : null,
            orderSummaryHandler: availableServices[serviceKey] != undefined && availableServices[serviceKey].orderSummaryHandler ? availableServices[serviceKey].orderSummaryHandler : null,
            purchaseHandler: availableServices[serviceKey] != undefined && availableServices[serviceKey].purchaseHandler ? availableServices[serviceKey].purchaseHandler : null,
            errors: errorsFound
        };
    }

    /**
     * @param serviceKey
     * @param body
     * @returns {Promise}
     */
    static getForm(serviceKey, body) {
        var promiseCallback = function (resolve, reject) {
            try {
                let step = this.validateAndGetNextStep(serviceKey, body);
                if (step.isLast) {
                    resolve({
                        "serviceKey": serviceKey,
                        "elements": []
                    });
                }

                //Build FormElements instance
                let formElements = FormElementFactory.create(serviceKey, step.fields, step);

                if (step.requestHandler !== undefined &&
                    typeof RequestHandlers[step.requestHandler] === 'function') {

                    RequestHandlers[step.requestHandler](formElements, serviceKey, body)
                        .then((formElements) => {
                            resolve(formElements);
                        })
                        .catch((error) => {
                            if (error instanceof AppError) {
                                return reject(error);
                            }
                            return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error building form elements from handler ${error}`, []));
                        });
                } else {
                    resolve(formElements);
                }
            } catch (error) {
                return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, 'Error validating form and getting next step', []));
            }
        };

        return new Promise(promiseCallback.bind(this));
    }
}
