/* istanbul ignore next */
module.exports = {

    noRequestHandler: function(formElement, serviceKey, body) {
        return new Promise((resolve, reject) => {
            resolve(this.noResponseCallBack(formElement, serviceKey, body));
        });
    },

    noResponseCallBack: function(formElement, serviceKey, body) {
        return new Promise((resolve, reject) => {
            resolve(formElement);
        });
    }
}