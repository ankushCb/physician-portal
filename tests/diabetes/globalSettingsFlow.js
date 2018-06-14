const { createNewPatient } = require('../common/createNewPatient');
const { openDiabetesForAPatient } = require('../common/openDiabetesForAPatient');

/* eslint-disable */
// Patient List page selector
const ADD_PATIENT_BUTTON_SELECTOR = 'primary-button';
const ONBOARDING_SORT_SELECTOR = 'thead > tr > th:nth-child(4)';
const FIRST_ONBOARDED_PATIENT = 'tbody > tr > td > a';

// Diabetes Overview page selector
const DIABETES_SETTINGS_NAVIGATE = 'button.primary-button';

// Diabetes Settings page selector

const BACK_TO_OVERVIEW_BUTTON = 'button.bordered-button';

// Thresholds
const GS_HYPER_SELECTOR = 'input[name="diabetesThresholds.hyperglycemiaThresholdEmergency"]';
const GS_GOAL_SELECTOR = 'input[name="diabetesThresholds.hyperglycemiaTitrationThresholdSmall"]';
const GS_HYPO_SELECTOR = 'input[name="diabetesThresholds.hypoglycemiaGlucoseThresholdMild"]';

const PREMADE_REGIMEN_SELECTOR = 'label[for="regimenOptions"]';
const PREMADE_REGIMEN_BASAL_BOLUS_SELECTOR = 'div.insulin-options > div > input';
const PREMADE_REGIMEN_BASAL_BOLUS_OPTION_SELECTOR = (index) => `label.regimen-dropdown-label + div > ul > li:nth-child(${index})`;

const CORRECTIONAL_ON_SELECTOR = 'label[for="correctionalOn"] + span > label > span.circular-switch';
const NEGATIVE_CORRECTION_SELECTOR = 'label.negativeCorrectionalOn > span.circular-switch.on';

const INSULIN_PRESCRIPTION_HYPER = 'table.insulin-prescription-table > tbody > tr:last-child > td:first-child';
const INSULIN_PRESCRIPTION_HYPO = 'table.insulin-prescription-table > tbody > tr:nth-child(3) > td:first-child';
const INSULIN_PRESCRIPTION_ROWS_COUNT = 'table.insulin-prescription-table > tbody > tr';

const INSULIN_PRESCRIPTION_GET_CURRENTROW_BG = (index) => {
  return `table.insulin-prescription-table > tbody > tr:nth-child(${index}) > td:first-child`;
};

const CORRECTION_TARGET = 'input[name="correctionalDetails.correctionTarget"]';
const CORRECTION_FACTOR = 'input[name="correctionalDetails.correctionFactor"]';
const CORRECTION_INCREMENT = 'input[name="correctionalDetails.correctionIncrement"]';

const SCHEDULE_EACH_ROW_SELECTOR = 'tr.each-row';

const CARB_COUNT_CARD_SELECTOR = 'div.carb-counting';
const CARB_COUNT_DOSE = index => `input[name="scheduleData[${index}].carbCountingRatio"]`;

const GLOBAL_CARB_SELECTOR = 'input[name="carbCountingDetails.carbCountingRatio"]';

const getGlucoseRanges = (target, factor, emergency, maxRange = 5) => {
  // console.log(target, factor, emergency, maxRange);
  const ranges = [];
  let max = target;
  let min;
  do {
    min = max;
    max += factor;
    if (ranges.length === maxRange) {
      ranges.push({ min, max: emergency });
      break;
    }
    if (max <= emergency) {
      ranges.push({ min, max });
    }
  } while (max < emergency);
  // console.log('ranges ', ranges);
  return ranges;
};

const clickPremadeRegimenSelect = (client, index) => {
  client
    .click(PREMADE_REGIMEN_BASAL_BOLUS_SELECTOR)
    .pause(1000)
    .click(PREMADE_REGIMEN_BASAL_BOLUS_OPTION_SELECTOR(index))
    .pause(1000)
}

describe('Create a New Patient', () => {
  // createNewPatient();
  openDiabetesForAPatient();
});

describe('Diabetes Settings Page Navigation', () => {
  
  it('Moves to settings page on click of appropriate button', (client) => {
    // Both with / without regimen has a single primary button. click that to navigate 
    client
      .pause(20000)
      .waitForElementVisible(BACK_TO_OVERVIEW_BUTTON, 40000)
      .getText(BACK_TO_OVERVIEW_BUTTON, function(result) {
        this.assert.equal(result.value, 'Back to overview');
      })
  });

  it('Sets a Premade Regimen to start with ', (client) => {
    client
      .click(PREMADE_REGIMEN_SELECTOR)
    clickPremadeRegimenSelect(client, 1);
    client  
      .assert.ok(true);
  });

  it('Hyper change has intended effect', (client) => {
    client
      .clearValue(GS_HYPER_SELECTOR)
      .setValue(GS_HYPER_SELECTOR, '570')
      .getText(INSULIN_PRESCRIPTION_HYPER, function(result) {
        this.assert.equal('570+', result.value);
      })
  });

  it('Hypo change has intended effect', (client) => {
    client
    .clearValue(GS_HYPO_SELECTOR)
    .setValue(GS_HYPO_SELECTOR, 100)
    .getText(INSULIN_PRESCRIPTION_HYPO, function(result) {
      this.assert.equal('< 100', result.value);
    })
  });

});

describe('Insulin Select', () => {
  // checks whether all premade regimen gets selected properly
  it('Premade Regimen works correctly', (client) => {
    const premadeSize = [0, 5, 4, 5, 2, 2, 5, 4, 5];

    clickPremadeRegimenSelect(client, 1);
    client
      .pause(500)
      .elements('css selector', SCHEDULE_EACH_ROW_SELECTOR, function(result) {
        this.assert.equal(result.value.length, premadeSize[1]);
      });

    clickPremadeRegimenSelect(client, 4);
    client
      .pause(500)
      .elements('css selector', SCHEDULE_EACH_ROW_SELECTOR, function(result) {
        this.assert.equal(result.value.length, premadeSize[4]);
    });
    
    clickPremadeRegimenSelect(client, 7);
    client
      .pause(500)
      .elements('css selector', SCHEDULE_EACH_ROW_SELECTOR, function(result) {
        this.assert.equal(result.value.length, premadeSize[7]);
    });
  });

  // Clicking carb count does the intended
  it('Clicking Carb counting regimen opens carb count setting', (client) => {
    clickPremadeRegimenSelect(client, 7);
    client
      .waitForElementVisible(CARB_COUNT_CARD_SELECTOR, 20000)
      .assert.ok(true);
  });

  // Clicking carb count does the intended
  it('Clicking Carb counting regimen changes schedule correctly', (client) => {
    client
      .waitForElementVisible(CARB_COUNT_DOSE(1), 20000)
      .waitForElementVisible(CARB_COUNT_DOSE(2), 20000)
      .waitForElementVisible(CARB_COUNT_DOSE(4), 20000)
      .assert.ok(true);
  });
});

describe('Correctional Select', () => {
  it('Has correct number of Prescription rows', (client) => {
    // client
    //   .elements('css selector', INSULIN_PRESCRIPTION_ROWS_COUNT, function(result) {
    //     this.assert.equal(result.value.length, 14);
    //   });
    client
      .setValue(GS_HYPO_SELECTOR, 70)
      .click(CORRECTIONAL_ON_SELECTOR)
      .elements('css selector', INSULIN_PRESCRIPTION_ROWS_COUNT, function(result) {
        this.assert.equal(result.value.length, 5);
      });
  });

  it('Changing target and factor has intended effect', (client) => {
    const glucoseRange = getGlucoseRanges(120, 70, 600)
    client
    .click(CORRECTIONAL_ON_SELECTOR)
    .clearValue(CORRECTION_TARGET)
    .setValue(CORRECTION_TARGET, 120)
    .clearValue(CORRECTION_FACTOR)
    .setValue(CORRECTION_FACTOR, 80)
    .clearValue(GS_HYPER_SELECTOR)
    .setValue(GS_HYPER_SELECTOR, 600)

    client
      .getText(INSULIN_PRESCRIPTION_GET_CURRENTROW_BG(5), function(result) {
        this.assert.equal(result.value, '70 - 150');
      })
      .getText(INSULIN_PRESCRIPTION_GET_CURRENTROW_BG(6), function(result) {
        this.assert.equal(result.value, '150 - 230');
      })
      .getText(INSULIN_PRESCRIPTION_GET_CURRENTROW_BG(10), function(result) {
        this.assert.equal(result.value, '470 - 600');
      })
  });
});

describe('Carb Counting Settings', () => {
  it ('Changes in global carb has intended effect', (client) => {
    clickPremadeRegimenSelect(client, 6);
    client
      .pause(1000)
      .setValue(GLOBAL_CARB_SELECTOR, 12)
      .getValue('input[name="scheduleData[1].carbCountingRatio"]', function(result) {
        this.assert.equal(result.value, 12)
      })
      .getValue('input[name="scheduleData[2].carbCountingRatio"]', function(result) {
        this.assert.equal(result.value, 12)
      })
      .getValue('input[name="scheduleData[4].carbCountingRatio"]', function(result) {
        this.assert.equal(result.value, 12)
      })
  });
})

