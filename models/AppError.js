module.exports = class AppError {
    constructor(httpStatusCode, code, response, errors, extraInfo=[]) {
        this.httpStatusCode = httpStatusCode;
        this.code = code;
        this.response = response;
        this.errors = errors;
        this.extraInfo = extraInfo;
    }
}
