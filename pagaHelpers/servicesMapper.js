const mapper = {

    // TV

    TV_PAGA_DSTV: {
        lynetype: 'A3878DC1-F07D-48E7-AA59-8276C3C26647',
        service_key: 'tv.paga.dstv',
        destination: 'smart_card_number',
        has_plans:true,
        has_cascade:true,
        cascade_name:"NGN_.Box Office",
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },

    TV_PAGA_GOTV: {
        lynetype: 'D66C40A6-CA65-4CF7-88A1-BDF748CF0627',
        service_key: 'tv.paga.gotv',
        destination: 'uic_number',
        has_plans:true,
        has_cascade:false,
        message_missing_destination: 'Missing UIC Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and UIC number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
    TV_PAGA_STARTIMES: {
        lynetype: '39BA1DC-5CE2-4EBC-B355-6011716192C8',
        service_key: 'tv.paga.startimes',
        destination: 'smart_card_number',
        has_plans:true,
        has_cascade:false,
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },

    TV_PAGA_MONTAGE: {
        lynetype: 'C9076638-9974-41BF-9D33-47A0008AA21B',
        service_key: 'tv.paga.montage',
        destination: 'smart_card_number',
        has_plans:true,
        has_cascade:false,
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },


    TV_PAGA_KWESE: {
        lynetype: '6A4E66C7-4E46-4CFB-A58D-CB7EB96CF5E6',
        service_key: 'tv.paga.kwese',
        destination: 'account_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation:true,
        prevalidation_error_message: 'Please make sure your operator and Account number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },

    TV_PAGA_METRODIGITAL: {
        lynetype: 'bd6d6165-5c2f-44f2-8f7b-f5306df3466d',
        service_key: 'tv.paga.metrodigital',
        destination: 'account_number',
        has_plans:true,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your operator and Account number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
 
    // INTERNET

    INTERNET_PAGA_SWIFT: {
        lynetype: '21e818c7-db0a-4042-bc7a-a18da33ec3e5',
        service_key: 'internet.paga.swift',
        destination: 'customer_id',
        has_plans:false,
        has_cascade:false,
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
        has_cascade:true,
        cascade_name:"NGN_.Buy Airtime",
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
        has_cascade:true,
        cascade_name:"Refill",
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: true, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
     //TOLL
     TOLL_LTC: {
        lynetype: '602a536f-462e-4e56-aedd-72399469e772',
        service_key: 'toll.ltc',
        destination: 'account_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //BET
    BET_1960BET: {
        lynetype: '5784B1A2-4F01-4BAA-B2B0-EAFB1C9113EF',
        service_key: 'bet.1960bet',
        destination: 'account_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    BET_WASERE: {
        lynetype: '20b23920-b100-4026-ab89-34a29c48d67f',
        service_key: 'bet.wasere',
        destination: 'account_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    
    BET_9JAPREDICT: {
        lynetype: 'd9754e95-0872-4762-b367-149df8182379',
        service_key: 'bet.9japredict',
        destination: 'account_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },
    BET_BONANZAWIN: {
        lynetype: 'e51b5753-ddc7-4b11-88b3-4ea25d72c33c',
        service_key: 'bet.bonanzawin',
        destination: 'account_number',
        has_plans:true,
        has_cascade:false,
        message_missing_destination: 'Missing Account Number',
        order_summary_needs_prevalidation: false,
        prevalidation_error_message: 'Please make sure your account number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //ELECTRICITY PREPAID

    ELECTRICITY_PREPAID_IKEJA: {
        lynetype: 'b0b29340-2bdb-43ae-b165-7e8606234e43',
        service_key: 'electricity.prepaid.ikeja',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },
    ELECTRICITY_PREPAID_EKO: {
        lynetype: '8E7485D9-1A67-4205-A49D-691E5B78C20D',
        service_key: 'electricity.prepaid.eko',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_PREPAID_ABUJA: {
        lynetype: '13B5041B-7143-46B1-9A88-F355AD7EA1EC',
        service_key: 'electricity.prepaid.abuja',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
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
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_PREPAID_PORTHARCOUT: {
        lynetype: 'A5B4DACC-0391-4887-A76E-2B0584A8C985',
        service_key: 'electricity.prepaid.portharcout',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    //ELECTRICITY POSTPAID

    ELECTRICITY_POSTPAID_IKEJA: {
        lynetype: 'b0b29340-2bdb-43ae-b165-7e8606234e43',
        service_key: 'electricity.postpaid.ikeja',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

    ELECTRICITY_POSTPAID_EKO: {
        lynetype: '8E7485D9-1A67-4205-A49D-691E5B78C20D',
        service_key: 'electricity.postpaid.eko',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
        message_missing_destination: 'Missing Meter Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your meter number is correct. ' +
        'Otherwise, please check your account status with your operator.'
    },

   
    ELECTRICITY_POSTPAID_KADUNA: {
        lynetype: '2258C05A-F6DF-4CCB-900D-481962F7E026',
        service_key: 'electricity.postpaid.kaduna',
        destination: 'meter_number',
        has_plans:false,
        has_cascade:false,
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
        has_cascade:false,
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
