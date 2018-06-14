const ONBOARDING_SORT_SELECTOR = 'thead > tr > th:nth-child(4)';
const FIRST_ONBOARDED_PATIENT = 'tbody > tr > td > a';
const WRITE_PRESCRIPTION_BUTTON = 'button[type="button"]';

const openDiabetesForAPatient = () => {
  it('Opening a Patient', (client) => {  
    let currentUrl;
    client
      .url('http://localhost:3002')
      .execute(function(data) {
        localStorage.token = 'Token a255874e34ef73cd5e6060f052728eaab1c737f3';
      }, []);
    client
      .url('http://localhost:3002')
      .waitForElementVisible('button', 20000)
      .click(ONBOARDING_SORT_SELECTOR)
      .pause(500)
      .click(FIRST_ONBOARDED_PATIENT)
      .waitForElementVisible(WRITE_PRESCRIPTION_BUTTON, 20000)
      .click(WRITE_PRESCRIPTION_BUTTON)
      .pause(2000)
      .url('http://localhost:3002/physician/patients/f2898a46-3921-4abf-b7a6-56d4935f48cc/settings/v2');
  });
}

module.exports = {
  openDiabetesForAPatient: openDiabetesForAPatient,
}