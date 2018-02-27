module.exports = class PaymentDetailItem {
    /**
     * @param {String} label 
     * @param {Float} value 
     * @param {Object []} value 
     */
    constructor(type, value, options) {
        this.type = type;
        this.value = value;
        this.options = options;
    }
} 