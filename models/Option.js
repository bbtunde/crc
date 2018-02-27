module.exports = class Option {
    constructor(label, icon, optionValue, displayValue, message, preSelected, formElements) {

        this.label = label;
        this.icon = icon;
        this.option_value = optionValue;
        this.display_value = displayValue;
        this.message = message;
        this.preselected = preSelected;
        this.form_elements = formElements;
    }
}