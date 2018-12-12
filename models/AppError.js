module.exports = class AppError {
    constructor(httpStatusCode, code, response, errors) {
        this.httpStatusCode = httpStatusCode;
        this.code = code;
        this.response = response;
        this.errors = errors;
    }
}
