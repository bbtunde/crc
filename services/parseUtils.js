module.exports = class ParseUtils {
    
    static parseMoneyAmountValue(money) {
        try {
            let NUMERIC_REGEXP = /[-]{0,1}[\d.]*[\d]+/g;
            let numbers = money.match(NUMERIC_REGEXP).map(Number);

            return numbers[0];
        } catch (error) {
            throw new Error('Error parsing amount');
        }
    }

    static parseMoneyCurrencyValue(money) {
        try {
            let _data = money.split("_");
            if (_data.length === 2) {
                return _data[0];
            }
            throw new Error('Error parsing amount');
        } catch (error) {
            throw new Error('Error parsing amount');
        }
    }

    static parsePhoneNumberWithCountryValue(phoneNumber) {
        try {
            let _data = phoneNumber.split("_");
            if (_data.length === 2) {
                return _data[1];
            }
            throw new Error('Error parsing phone number');
        } catch (error) {
            throw new Error('Error parsing phone number');
        }
        
    }
    
    static parsePhoneCodeValue(phoneNumber) {
        try {
            let _data = phoneNumber.split("_");
            if (_data.length === 2) {
                return _data[0];
            }
            throw new Error('Error parsing phone number');
        } catch (error) {
            throw new Error('Error parsing phone number');
        }
        
    }
}
