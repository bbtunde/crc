class Validator {
    constructor(type, options, message) {
        this.type = type;
        this.options = options;
        this.message = message;
    }
}

class RegexValidator extends Validator {
    constructor(type, options, messages, regexExpression) {
        super(type, options, messages);

        this.regexExpression = regexExpression;
    }
}

module.exports = {
    RegexValidator : RegexValidator,
    Validator : Validator,
}
