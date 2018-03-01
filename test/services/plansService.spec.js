var rewire = require('rewire');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var AppError = require('./../../models/AppError');

var pagaMessage = {
  responseCode: 0,
  message: 'Success',
  referenceNumber: 'jone1519902184026',
  services:
    [ 
     { name: '5GB Night & Weekend Data Bundle',
       code: null,
       price: 400,
       shortCode: '5GB' },
     { name: '1GB Data Bundle',
       code: null,
       price: 1000,
       shortCode: '1GB' },
     { name: '3GB Data Bundle',
       code: null,
       price: 3000,
       shortCode: '3GB' },
     { name: '5GB Data Bundle',
       code: null,
       price: 5000,
       shortCode: '5GB' },
     { name: '10GB Night & Weekend Data Bundle',
       code: null,
       price: 7500,
       shortCode: '10G' },
     { name: '10GB Data Bundle',
       code: null,
       price: 9000,
       shortCode: '10G' },
     { name: '20GB Night & Weekend Data Bundle',
       code: null,
       price: 14000,
       shortCode: '20G' },
     { name: '20GB Data Bundle',
       code: null,
       price: 17000,
       shortCode: '20G' },
     { name: '50GB Data Bundle',
       code: null,
       price: 36000,
       shortCode: '50G' },
     { name: '100GB Data Bundle',
       code: null,
       price: 70000,
       shortCode: '100' },
     { name: '500MB Data Bundle',
       code: null,
       price: 500000,
       shortCode: '500' },
     { name: '200GB Data Bundle',
       code: null,
       price: 200000,
       shortCode: '200' },
     { name: '5GB Anytime Data Plan',
       code: '150',
       price: 4001,
       shortCode: '5GB' },
     { name: '10GB Anytime Data Plan',
       code: '400',
       price: 7501,
       shortCode: '10GB' } 
    ] 
};


var mockPlans = [  
  { name: '5GB Night & Weekend Data Bundle',
       code: null,
       price: 400,
       shortCode: '5GB' },
     { name: '1GB Data Bundle',
       code: null,
       price: 1000,
       shortCode: '1GB' }
];

var mockOptions = [  
   {
    "label": "5GB Night & Weekend Data Bundle",
    "icon": "",
    "option_value": "NGN_400.5GB Night & Weekend Data Bundle",
    "display_value": "NGN 5GB Night & Weekend Data Bundle",
    "message": "",
    "preselected": false,
    "form_elements": []
  },
  {
      "label": "1GB Data Bundle",
      "icon": "",
      "option_value": "NGN_1000.1GB Data Bundle",
      "display_value": "NGN 1GB Data Bundle",
      "message": "",
      "preselected": false,
      "form_elements": []
  }
];

describe('PlansService', function () {
  it('checks parsePlansToOptions', async function () {

    var plansService = require('./../../services/plansService');

    let result = plansService.parsePlansToOptions(mockPlans);
    expect(result).to.deep.equal(mockOptions);

    try {
      let errorResult = plansService.parsePlansToOptions('Dummy data');
    } catch (error) {
      expect(error.message).to.deep.equal('Error parsing plans to options');
    }
  });
})
