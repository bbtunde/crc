const Joi = require('joi');

module.exports = class ServiceSchemaValidation {

    constructor(service) {
        this.service = service;
    }

    getSchema() {

        let validatorOptionSchema = {
            option: Joi.string().required(),
            value: Joi.any().required(),
            message: Joi.string()
        };

        let validatorSchema = {
            type: Joi.string(),
            options: Joi.array().min(0).items(Joi.object(validatorOptionSchema)),
            message: Joi.string()
        };

        let formElementsSchema = {
            key: Joi.string().required(),
            template: Joi.string().required(),
            title: Joi.string().required(),
            label: Joi.string().required(),
            validators: Joi.array().min(0).items(Joi.object(validatorSchema))
        };

        let optionSchema = {
            label: Joi.string().required(),
            icon: Joi.any(),
            option_value: Joi.any().required(),
            message: Joi.any(),
            preselected: Joi.boolean().required(),
            form_elements: Joi.array().min(0).items(Joi.object(formElementsSchema))
        };

        formElementsSchema["options"] = Joi.array().min(0).items(Joi.object(optionSchema)).required();

        let stepsSchema = {
            fields: Joi.array().min(1).items(Joi.object(formElementsSchema)).required(),
            requestHandler: Joi.string()
        };

        return Joi.object().keys({
            orderSummaryHandler: Joi.string(),
            purchaseHandler: Joi.string(),
            definition: Joi.any(),
            destination: Joi.string().required(),
            extra_info: Joi.boolean().required(),
            steps: Joi.array().min(1).items(Joi.object(stepsSchema)).required()
        });
    }

    validate() {
        return Joi.validate(this.service, this.getSchema());
    }
}
