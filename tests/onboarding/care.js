const ADD_BUTTON_SELECTOR = 'button[id="add"]';
const EDIT_BUTTON_SELECTOR = index => `button[id="edit"]:nth-child(${index})`;
const SUBMIT_BUTTON = 'button[type="submit"]';

const careFormSubmit = () => {
  it('Care Form could be filled correctly', (client) => {
    client
      .setValue('input[placeholder="Medication Name"]', 'i')
      .pause(5000)
      .click('.hoverable-btn')
      .setValue('input[name="row[0].medicationDose"]', 5)
      .setValue('input[name="row[0].unitName"]', 'mg')
      .setValue('input[placeholder="Frequency"]', 'q')
      .click('.hoverable-btn')
      .click(ADD_BUTTON_SELECTOR)
      .click(EDIT_BUTTON_SELECTOR(1))
      .clearValue('input[name="row[0].medicationDose"]')
      .setValue('input[name="row[0].medicationDose"]', 4)
      .clearValue('input[name="row[0].unitName"]')
      .setValue('input[name="row[0].unitName"]', 'mgs')
      .clearValue('input[placeholder="Medication Name"]')
      .setValue('input[placeholder="Medication Name"]', 'ibupro')
      .pause(5000)
      .click('.hoverable-btn')
      .click(EDIT_BUTTON_SELECTOR(1))
      .click(SUBMIT_BUTTON);
  });
};

module.exports = {
  careFormSubmit: careFormSubmit,
}