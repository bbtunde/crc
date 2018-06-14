var cron = require('node-cron');
const config = require('../config/config.json');
const plansService = require('./plansService');
const CacheService = require('./cacheService');

var cronTaskPlansDSTV = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for DSTV...');
    plansService.getPlans("A3878DC1-F07D-48E7-AA59-8276C3C26647")
    .then(plans => {
        CacheService.set('DSTV', plans);
        console.log('Plans for DSTV successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for DSTV. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

var cronTaskPlansGOTV = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for GOTV...');
    plansService.getPlans("D66C40A6-CA65-4CF7-88A1-BDF748CF0627")
    .then(plans => {
        CacheService.set('GOTV', plans);
        console.log('Plans for GOTV successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for GOTV. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);


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

var cronTaskPlansSTARTIMES = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for STARTIMES...');
    plansService.getPlans("39BA1DC-5CE2-4EBC-B355-6011716192C8")
    .then(plans => {
        CacheService.set('STARTIMES', plans);
        console.log('Plans for STARTIMES successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for STARTIMES. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

var cronTaskPlansMONTAGE = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for MONTAGE...');
    plansService.getPlans("C9076638-9974-41BF-9D33-47A0008AA21B")
    .then(plans => {
        CacheService.set('MONTAGE', plans);
        console.log('Plans for MONTAGE successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for MONTAGE. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

var cronTaskPlansMETRODIGITAL = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for METRODIGITAL...');
    plansService.getPlans("bd6d6165-5c2f-44f2-8f7b-f5306df3466d")
    .then(plans => {
        CacheService.set('METRODIGITAL', plans);
        console.log('Plans for METRODIGITAL successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for METRODIGITAL. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);


module.exports.cronTaskPlansSMILE = cronTaskPlansSMILE;
module.exports.cronTaskPlansDSTV = cronTaskPlansDSTV;
module.exports.cronTaskPlansGOTV = cronTaskPlansGOTV;
module.exports.cronTaskPlansSTARTIMES = cronTaskPlansSTARTIMES;
module.exports.cronTaskPlansMONTAGE = cronTaskPlansMONTAGE;
module.exports.cronTaskPlansMETRODIGITAL = cronTaskPlansMETRODIGITAL;

