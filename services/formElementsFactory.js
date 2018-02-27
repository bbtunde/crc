const FormElements = require('../models/FormElements');
const FormElement = require('../models/FormElement');

module.exports = class FormElementsFactory {

    /**
     * Create a FormElements Instance
     * 
     * @param {String} serviceKey 
     * @param {Array} fields 
     * @param {Object} step 
     * @returns {FormElements}
     */
    static create(serviceKey, fields, step) {

        let elements = [];

        for (let field in fields) {
            elements.push(new FormElement(fields[field]));
        }

        return new FormElements(serviceKey, elements, step.currentStep, step.stepCount);
    }
}
