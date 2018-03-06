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
      { name: 'ACCESS',
        code: 'ACSSW4',
        price: 1500, 
        shortCode: 'ACC' },
      { name: 'FAMILY',
        code: 'COFAMW4',
        price: 3000, 
        shortCode: 'FAM' },
      { name: 'MINI',
        code: null, 
        price: 5000, 
        shortCode: 'MIN' },
      { name: 'PREMIUM',
        code: null,
        price: 15000,
        shortCode: 'PRE' }
    ] 
};


var mockPlans = [  
  { name: 'ACCESS',
    code: 'ACSSW4',
    price: 1500, 
    shortCode: 'ACC' },
    { name: 'FAMILY',
      code: 'COFAMW4',
      price: 3000, 
      shortCode: 'FAM'},
];

var mockOptions = [  
    {
      "label": "ACCESS",
      "icon": "",
      "option_value": "NGN_1500.ACCESS",
      "display_value": "NGN ACCESS",
      "message": "",
      "preselected": false,
      "form_elements": []
    },
    {
        "label": "FAMILY",
        "icon": "",
        "option_value": "NGN_3000.FAMILY",
        "display_value": "NGN FAMILY",
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
