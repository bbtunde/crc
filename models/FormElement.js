module.exports = class FormElement {
    constructor(element) {

        this.key = element.key;
        this.template = element.template;
        this.title = element.title;
        this.label = element.label;
        this.validators = element.validators;
        this.options = element.options;
    }

    setValidators(validators) {
        this.validators = validators;
    }
    
    setOptions(options) {
        this.options = options;
    }   
}