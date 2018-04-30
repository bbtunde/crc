const mapper = {

    // TV

    TV_PAGA_DSTV: {
        lynetype: 'A3878DC1-F07D-48E7-AA59-8276C3C26647',
        service_key: 'tv.paga.dstv',
        destination: 'smart_card_number',
        has_plans:true,
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
    // INTERNET

    INTERNET_PAGA_SWIFT: {
        lynetype: '21e818c7-db0a-4042-bc7a-a18da33ec3e5',
        service_key: 'internet.paga.swift',
        destination: 'customer_id',
        has_plans:false,
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: true, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
     INTERNET_PAGA_SMILE: {

        lynetype: 'E5E5CF1D-3F53-4273-83A7-6E678EBD7C15',
        service_key: 'internet.paga.smile',
        destination: 'customer_id',
        has_plans:true,
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: true, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
    INTERNET_PAGA_SPECTRANET: {

        lynetype: 'E5E5CF1D-3F53-4273-83A7-6E678EBD7C15',
        service_key: 'internet.paga.spectranet',
        destination: 'customer_id',
        has_plans:false,
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: false, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
     //TOLL
     TOLL_LTC: {
        lynetype: '29abd794-f91f-43c2-a42e-23425d15cab6',
        service_key: 'toll.ltc',
        destination: 'account_number',
        has_plans:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //BET
    BET_1960BET: {
        lynetype: 'F444494D-0AA9-47FC-B6E0-6987535A5777',
        service_key: 'bet.1960bet',
        destination: 'account_number',
        has_plans:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    BET_WASERE: {
        lynetype: '20b23920-b100-4026-ab89-34a29c48d67f',
        service_key: 'bet.wasere',
        destination: 'account_number',
        has_plans:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    
    BET_9JAPREDICT: {
        lynetype: 'c4adef5e-55b5-463c-a055-efd5c28cacbd',
        service_key: 'bet.9japredict',
        destination: 'account_number',
        has_plans:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },
    BET_BONANZAWIN: {
        lynetype: 'e51b5753-ddc7-4b11-88b3-4ea25d72c33c',
        service_key: 'bet.bonanzawin',
        destination: 'account_number',
        has_plans:true,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //ELECTRICITY PREPAID
    ELECTRICITY_PREPAID_ABUJA: {
        lynetype: 'B590205C-4C01-458D-9CC5-D7DAE2942478',
        service_key: 'electricity.prepaid.abuja',
        destination: 'meter_number',
        has_plans:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_PREPAID_KADUNA: {
        lynetype: '2258C05A-F6DF-4CCB-900D-481962F7E026',
        service_key: 'electricity.prepaid.kaduna',
        destination: 'meter_number',
        has_plans:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_PREPAID_PORTHARCOUT: {
        lynetype: 'A5B4DACC-0391-4887-A76E-2B0584A8C985',
        service_key: 'electricity.prepaid.portharcout',
        destination: 'meter_number',
        has_plans:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //ELECTRICITY POSTPAID
   
    ELECTRICITY_POSTPAID_KADUNA: {
        lynetype: '2258C05A-F6DF-4CCB-900D-481962F7E026',
        service_key: 'electricity.postpaid.kaduna',
        destination: 'meter_number',
        has_plans:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_POSTPAID_PORTHARCOUT: {
        lynetype: 'A5B4DACC-0391-4887-A76E-2B0584A8C985',
        service_key: 'electricity.postpaid.portharcout',
        destination: 'meter_number',
        has_plans:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    }

};

const services = Object.keys(mapper);

/* istanbul ignore next */
module.exports.mapper = mapper;

/* istanbul ignore next */
module.exports.serviceDataByServiceKey = (argServiceKey) => {

    for (let i = 0; i < services.length; i++) {
        if (mapper[services[i]].service_key == argServiceKey) {
            return mapper[`${services[i]}`];
        }
    }

    return null;
}

/* istanbul ignore next */
module.exports.serviceKeys = () => {

    let serviceKeys = [];
    services.map(service => {
        serviceKeys.push(mapper[service].service_key);
    });

    return serviceKeys;
}
