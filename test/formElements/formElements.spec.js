var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var FormElements = require('./../../models/FormElements.js');
var FormElement = require('./../../models/FormElement.js');
var Option = require('./../../models/Option.js');
var validators = require('./../../models/Validators.js');

describe('Form Elements', function () {

  /*Option*/

  it('get an Option instance', function () {

    let instance = new Option('test label', 'my/icon', "option_value", "display_value", "message", false, []);

    expect(instance).to.have.property('label');
    assert.isTrue(instance.label === 'test label');

    expect(instance).to.have.property('icon');
    assert.isTrue(instance.icon === 'my/icon');

    expect(instance).to.have.property('option_value');
    assert.isTrue(instance.option_value === 'option_value');

    expect(instance).to.have.property('display_value');
    assert.isTrue(instance.display_value === 'display_value');

    expect(instance).to.have.property('message');
    assert.isTrue(instance.message === 'message');  

    expect(instance).to.have.property('preselected');
    assert.isTrue(instance.preselected === false);

    expect(instance).to.have.property('form_elements');
    assert.isTrue(JSON.stringify(instance.form_elements) === JSON.stringify([]));
  });

  /*FormElement*/

  it('get a FormElement instance', function () {

    let validator = new validators.RegexValidator('validator test name', 'validator test error message', '[//**/validator_regex]');
    let option = new Option('test label', 'my/icon', "option_value", "display_value", false, []);
    let instance = new FormElement({
      key: 1, 
      template: 'test template', 
      title: 'test label', 
      label: 'test label', 
      validators: [validator], 
      options: [option, option]
    });

    instance.setValidators([validator]);
    instance.setOptions([option, option]);

    expect(instance).to.have.property('key');
    assert.isTrue(instance.key === 1);

    expect(instance).to.have.property('template');
    assert.isTrue(instance.template === 'test template');

    expect(instance).to.have.property('label');
    assert.isTrue(instance.label === 'test label');

    expect(instance).to.have.property('validators');
    assert.isTrue(instance.validators !== null);

    expect(instance).to.have.property('options');
    assert.isTrue(instance.options.length === 2);
  });

  /*FormElements*/
  it('get a FormElements instance', function () {
    let validator = new validators.RegexValidator('validator test name', 'validator test error message', '[//**/validator_regex]');
    let option = new Option('test label', 'my/icon', "option_value", "display_value", false, []);
    let formElement = new FormElement({
      key: 'form.element.key', 
      template: 'test template', 
      title: 'test label', 
      label: 'test label', 
      validators: [validator], 
      options: [option, option]
    });

    let instance = new FormElements('service.key', [formElement, formElement], 1, 2);

    expect(instance).to.have.property('service_key');
    assert.isTrue(instance.service_key === 'service.key');
    expect(instance).to.have.property('elements');
    assert.isTrue(instance.elements.length === 2);
    expect(instance).to.have.property('step');
    assert.isTrue(instance.step === 1);
    expect(instance).to.have.property('step_count');
    assert.isTrue(instance.step_count === 2);
  });
})
