const { careFormSubmit } = require('./care');

/* eslint-disable */
const ADD_PATIENT_BUTTON_SELECTOR = 'primary-button';
const ADD_PATIENT_BUTTON = 'button.primary-button';

/* Personal Form selectors */
const FIRST_NAME_SELECTOR='input[name="firstName"]';
const LAST_NAME_SELECTOR='input[name="lastName"]';
const STATE_SELECTOR = 'input[name="state"]';
const EMAIL_SELECTOR = 'input[name="email"]';
const MOBILE_TELECOM_SELECTOR = 'input[name="mobileTelecom"]';
const getDOBSelector = type => `div.dropdowns > select:nth-child(${type})`;
const getDOBOptionSelector = (type, option) => (`select:nth-child(${type}) > option[value="${option}"]`)
const RADIO_MALE_SELECTOR = 'input[value="male"] + div'; // Selects sibling to male for Material UI
const PERSONAL_FORM_SUBMIT = 'button[type="submit"]';

/* Daily Schedule Selector */
const DAILY_SCHEDULE_MEAL_SELECTOR = 'div.daily-schedule';
const DAILY_FORM_SUBMIT = 'button[type="submit"]';

/* Care Modal Selector */
const CARE_MODAL_SELECTOR = 'div.care-modal';

// Function which fills the personal form
const fillPersonalForm = (client) => {
  const randomNumber = new Date().getTime();
  const randomEmail = `automated${randomNumber.toString()}@codebrahma.com`;
  const randomMobileNumber = randomNumber.toString().substring(3);  
  

  const STATE_OPTION_SELECTOR = 'ul > li:nth-child(3)';

  // Fills in all text fields
  client
    .setValue(FIRST_NAME_SELECTOR, 'Automated')
    .setValue(LAST_NAME_SELECTOR, 'User')
    .setValue(EMAIL_SELECTOR, randomEmail)
    .setValue(MOBILE_TELECOM_SELECTOR, randomMobileNumber)
  // Fills in State
  client
    .click(STATE_SELECTOR)
    .click(STATE_OPTION_SELECTOR)

  // Fills in Date of DOB
  client
    .click(getDOBSelector(1))
    .click(getDOBOptionSelector(1, 2))
  // Fills in Month of DOB
  client
    .click(getDOBSelector(2))
    .click(getDOBOptionSelector(2, 4))
  // Fills in Year of DOB
  client
    .click(getDOBSelector(3))
    .click(getDOBOptionSelector(3, 1905))

  // Fills in Rad
  client
    .click(RADIO_MALE_SELECTOR);
}

after((client, done) => {
  client.end();
  done();
});

describe('Patient List + Onboarding Page Functionality', () => {
  it('Patient list page loads correctly', (client) => {  
    /*
      Before writing any tests open the page
      Since localStorage is not directly supported
      execute the url then set and execute it back
    */
    client
    .url('http://localhost:3002')
    .execute(function(data) {
      localStorage.token = 'Token a255874e34ef73cd5e6060f052728eaab1c737f3';
    }, []);

    client
      .url('http://localhost:3002')
      .waitForElementVisible('button', 20000)
      .assert.cssClassPresent('button', ADD_PATIENT_BUTTON_SELECTOR);
  });

  it('Add Patient Modal opens correctly', (client) => {
    client
      .click(ADD_PATIENT_BUTTON)
      .waitForElementVisible('div.onboard-modal', 2000)
      .assert.ok(true);
  });

  it('Able to fill elements correctly', (client) => {
    fillPersonalForm(client);
    client.assert.ok(true);
  })

  it('Able to move to daily schedule form', (client) => {
    client
      .pause(1000)
      .click(PERSONAL_FORM_SUBMIT)
      .waitForElementVisible(DAILY_SCHEDULE_MEAL_SELECTOR, 20000)
      .assert.ok(true);     
  });

  it('Onboards patient successfully', (client) => {
    client
      .click(DAILY_FORM_SUBMIT)
      .waitForElementVisible(CARE_MODAL_SELECTOR, 20000)
      .assert.ok(true);
  });

  careFormSubmit();

});

/* Corner cases for patient list + onboarding Page */
describe('Patient List + Onboarding Page Corner cases', () => {
  it ('Confirms email repetitions and identifies unique emails', (client) => {

    client
      .url('http://localhost:3002')
      .waitForElementVisible('button', 20000)
      .click(ADD_PATIENT_BUTTON)
      .waitForElementVisible('div.onboard-modal', 2000)
      .setValue(EMAIL_SELECTOR, 'prasanna@codebrahma.com')
      .waitForElementVisible('label + span', 20000)
      .getText('label + span', function(result) {
        this.assert.equal(result.value, 'User Already Registered with this email');
      })
      .clearValue(EMAIL_SELECTOR)
      .setValue(EMAIL_SELECTOR, 'prasanna6123123@codebrahma.com')
      .waitForElementNotPresent('label + span', 10000)
      .assert.ok(true);

  });
  
  it ('Confirms Mobile Number repetitions and identifies unique emails', (client) => {
    client
    .url('http://localhost:3002')
    .waitForElementVisible('button', 20000)
    .click(ADD_PATIENT_BUTTON)
    .waitForElementVisible('div.onboard-modal', 2000)
    .setValue(MOBILE_TELECOM_SELECTOR, '1234567890')
    .click(EMAIL_SELECTOR)
    .waitForElementVisible('label + span', 20000)
    .getText('label + span', function(result) {
      this.assert.equal(result.value, 'User Already Registered with this Number');
    });
  });
});