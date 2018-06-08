
module.exports = class pagaHelpers {

    static addAmountFieldToOption(option_name, options) {
        var formElement = {
            "key": "amount",
            "template": "money",
            "title": "How much do you want to top-up?",
            "label": "Top-up amount",
            "validators": [
                {
                    "type": "required",
                    "options": [],
                    "message": "Amount cannot be empty"
                },
                {
                    "type": "money",
                    "options": [
                        {
                            "option": "currency",
                            "value": "NGN",
                            "message": "We only support Nigerian Nairas"
                        },
                        {
                            "option": "min",
                            "value": "10",
                            "message": "Minimum amount: 10 NGN"
                        },
                        {
                            "option": "max",
                            "value": "100000",
                            "message": "Maximum amount: 100000 NGN"
                        }
                    ],
                    "message": "Invalid amount"
                }
            ],
            "options": [
                {
                    "label": "NGN",
                    "icon": "U+20A6",
                    "option_value": "NGN",
                    "message": "",
                    "preselected": true,
                    "form_elements": []
                }
            ]
        };
        //loop through options and insert formElements for specify option name
        for (let i in options) {
            if (options[i].option_value == option_name) {
                options[i].form_elements.push(formElement);
            }
        }
        return options;
    }


    /**
     * pass meter token from paga response
     * @param { Object } pagaSuccessResponse 
     */
    static getMeterTokenExtraInfo(successMessage) {
       
        let meterNumber=successMessage.merchantTransactionReference;
        return "Your meter token number is " + meterNumber;
       
    }
}