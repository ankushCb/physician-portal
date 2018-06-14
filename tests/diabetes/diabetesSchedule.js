const { openDiabetesForAPatient } = require('../common/openDiabetesForAPatient');
const PREMADE_REGIMEN_TOGGLE = 'label[for="insulinRequired"] + span > label > span.circular-switch'
const ADD_MEAL_BUTTON = 'button.primary-button';
const MEAL_SELECTOR = 'div.each-meal';
const DELETE_MEAL = 'button.error-button';
const SCHEDULE_CHECKBOX_SELECTOR = 'table.table > tbody > tr:first-child > td:first-child > div > label > input';
const SAVE_BUTTON = 'button[type="submit"]'
const MORNING_INSULIN_INPUT = 'input[name="morning.insulin"]';
const BREAKFAST_INSULIN_INPUT = 'input[name="breakfast.insulin"]';
const LUNCH_INSULIN_INPUT = 'input[name="lunch.insulin"]';
const MORNING_DOSE_INPUT = 'input[name="morning.baseDose"]';
const BASAL_INSULIN_INPUT = 'input[name="basalInsulin"]';
const BOLUS_INSULIN_INPUT = 'input[name="bolusInsulin"]';
const MIXED_INSULIN_INPUT = 'input[name="mixedInsulin"]';
const REGIMEN_INSULIN_INPUT = 'input[name="insulinRegimen"]';
const DROPDOWN_SELECTOR = (labelFor, indexToSelect) => `label[for="${labelFor}"] + div > ul > li:nth-child(${indexToSelect})`

describe('Open diabetes for a patient', () => {
	openDiabetesForAPatient();
});

describe('Diabetes schedule tests', () => {
	it('Fill all meals', (client) => {
    client.waitForElementVisible(ADD_MEAL_BUTTON, 20000);
    client
      .click(PREMADE_REGIMEN_TOGGLE)
      .click(PREMADE_REGIMEN_TOGGLE)
      
		client.expect.element(ADD_MEAL_BUTTON).to.not.be.enabled
		client.expect.element(SAVE_BUTTON).to.not.be.enabled
		// client
		// 	.click(PREMADE_REGIMEN_TOGGLE)
		// 	.expect.element(ADD_MEAL_BUTTON).to.be.enabled

		// for(let i = 0; i < 6; i++) {
		// 	client
		// 		.click(ADD_MEAL_BUTTON)
		// 		.isVisible(MEAL_SELECTOR, function(result) {
		// 			if (result.value) {
		// 				client.click(MEAL_SELECTOR)
		// 			} 
    //     })
    // }
	});

	// it('Able to add 6 timewindows for the day', (client) => {
  //   client
  //     .pause()
	// 		.elements('css selector', 'table.table > tbody > tr', function(result) {

	// 			this.assert.equal(result.value.length, 6);
	// 		});
	// });

	// it('`Delete timewindow` button enabled on check of any schedule', (client) => {
  //   client
  //     .pause()
	// 		.click(SCHEDULE_CHECKBOX_SELECTOR)
	// 		.waitForElementVisible(DELETE_MEAL, 20000)
	// 		.assert.ok(true);

	// 	client
	// 		.click(SCHEDULE_CHECKBOX_SELECTOR)
	// });

	// it('Selecting insulin type in schedule has intended effect in settings', (client) => {
	// 	client
	// 		.click(MORNING_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('morning.insulin', 2))
	// 		.waitForElementVisible(MORNING_DOSE_INPUT, 20000)
	// 		.getText(`${BASAL_INSULIN_INPUT} + span + span`, function(result) {
	// 			this.assert.equal(result.value, 'Required');
	// 		})

	// 	client
	// 		.click(BREAKFAST_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('breakfast.insulin', 3))
	// 		.pause(500)
	// 		.getText(`${BOLUS_INSULIN_INPUT} + span + span`, function(result) {
	// 			this.assert.equal(result.value, 'Required');
	// 		})

	// 	client
	// 		.click(LUNCH_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('lunch.insulin', 4))
	// 		.pause(500)
	// 		.getText(`${MIXED_INSULIN_INPUT} + span + span`, function(result) {
	// 			this.assert.equal(result.value, 'Required');
	// 		})
	// });

	// it('Changing insulin in settings has intended effect in timewindow', (client) => {
	// 	client
	// 		.click(BASAL_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('basalInsulin', 1))
	// 		.pause(500)
	// 		.getValue(BASAL_INSULIN_INPUT, function(result) {
	// 			this.assert.equal(result.value, 'Degludec');
	// 		})

	// 	client
	// 		.click(BOLUS_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('bolusInsulin', 1))
	// 		.pause(500)
	// 		.getValue(BOLUS_INSULIN_INPUT, function(result) {
	// 			this.assert.equal(result.value, 'Apidra');
	// 		})

	// 	client
	// 		.click(MIXED_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('mixedInsulin', 1))
	// 		.pause(500)
	// 		.getValue(MIXED_INSULIN_INPUT, function(result) {
	// 			this.assert.equal(result.value, 'Humalog 70-30');
	// 		})
	// });

	// it('Changing insulin type has intended effect in insulin dose', (client) => {
	// 	client
	// 		.click(MORNING_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('morning.insulin', 2))
	// 		.setValue(MORNING_DOSE_INPUT, '20')
	// 		.pause(500)
	// 		.click(MORNING_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('morning.insulin', 3))
	// 		.pause(1500)
	// 		.getValue(MORNING_DOSE_INPUT, function(result) {
	// 			this.assert.equal(result.value, '1');
	// 		});
	// });

	// it('Changing Premade regime type has intended effect in type of insulin drop down shown', (client) => {
	// 	client
	// 		.click(PREMADE_REGIMEN_TOGGLE)
	// 		.pause(500)
	// 		.getText(`${REGIMEN_INSULIN_INPUT} + span + span`, function(result) {
	// 			this.assert.equal(result.value, 'Required');
	// 		});

	// 	client
	// 		.click(REGIMEN_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 1))
	// 		.waitForElementVisible(BASAL_INSULIN_INPUT, 20000)
	// 		.waitForElementVisible(BOLUS_INSULIN_INPUT, 20000)

	// 	client
	// 		.click(REGIMEN_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 4))
	// 		.waitForElementVisible(MIXED_INSULIN_INPUT, 20000)

	// 	client
	// 		.click(REGIMEN_INSULIN_INPUT)
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 7))	
	// 		.waitForElementVisible(BASAL_INSULIN_INPUT, 20000)
	// 		.waitForElementVisible(BOLUS_INSULIN_INPUT, 20000)
	// });

	// it('Check if premade regimen reset on any value change', (client) => {
	// 	client
	// 		.click(REGIMEN_INSULIN_INPUT)
	// 		.pause(500)			
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 1))	
	// 		.click(MORNING_INSULIN_INPUT)
	// 		.pause(500)			
	// 		.click(DROPDOWN_SELECTOR('morning.insulin', 1))
	// 		.pause(500)
	// 		.assert.elementNotPresent(REGIMEN_INSULIN_INPUT)

	// 	client
	// 		.click(PREMADE_REGIMEN_TOGGLE)
	// 		.click(REGIMEN_INSULIN_INPUT)			
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 1))				
	// 		.pause(500)
	// 		.click(SCHEDULE_CHECKBOX_SELECTOR)
	// 		.pause(500)
	// 		.click(DELETE_MEAL)
	// 		.pause(500)
	// 		.assert.elementNotPresent(REGIMEN_INSULIN_INPUT)

	// 	client
	// 		.click(PREMADE_REGIMEN_TOGGLE)
	// 		.click(REGIMEN_INSULIN_INPUT)			
	// 		.click(DROPDOWN_SELECTOR('insulinRegimen', 1))				
	// 		.pause(500)
	// 		.click(ADD_MEAL_BUTTON)
	// 		.click(MEAL_SELECTOR)
	// 		.pause(500)
	// 		.assert.elementNotPresent(REGIMEN_INSULIN_INPUT)
	// });
	// 		// todo: test for enabled status of bgcheck
})

after((client, done) => {
  // client.end();
  // done();
});
