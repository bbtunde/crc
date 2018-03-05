var cron = require('node-cron');
const config = require('../config/config.json');
const plansService = require('./plansService');
const CacheService = require('./cacheService');

var cronTaskPlansSMILE = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for SMILE...');
    plansService.getPlans("E5E5CF1D-3F53-4273-83A7-6E678EBD7C15")
    .then(plans => {
        CacheService.set('SMILE', plans);
        console.log('Plans for SMILE successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for SMILE. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);


var cronTaskPlansSPECTRANET = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for SPECTRANET...');
    plansService.getPlans("F3B9CE63-3FB4-468B-83CE-2E3A0E2C8853")
    .then(plans => {
        CacheService.set('SPECTRANET', plans);
        console.log('Plans for SPECTRANET successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for SPECTRANET. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

 
module.exports.cronTaskPlansSMILE = cronTaskPlansSMILE;
module.exports.cronTaskPlansSPECTRANET = cronTaskPlansSPECTRANET;
