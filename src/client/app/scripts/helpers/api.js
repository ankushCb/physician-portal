// global API_URL
// development branch
import { APP_VERSION } from './appVersion.js';

const getBackendUrl = (processEnv) => {
  const backendConfig = processEnv.BACKEND;

  const backendUrl = backendConfig === 'prod' ? 'https://api.dosedr.com' : `https://${backendConfig || 'staging'}.dosedr.com`;
  console.log('<------------------------>');
  console.log(`%c App Version is ${APP_VERSION}`, 'background: #222; color: #bada55');
  console.log(`%c Backend Url ${backendUrl}`, 'background: #222; color: #bada55');
  console.log('<------------------------>');

  // return 'https://staging.dosedr.com';
  return backendUrl;
};

export const baseUrl = getBackendUrl(process.env);

// Function for binding base url
export const bindBaseUrl = route => (`${baseUrl}${route}`);

// Authentcation API
export const authApi = {
  login: bindBaseUrl('/auth/login/'),
};

// Patient API
export const patientsApi = {
  getPatients: bindBaseUrl('/api/patients/'),
  getPatient: id => (bindBaseUrl(`/api/patients/${id}/`)),
};

// Time-window
export const timeWindowApi = {
  getTimeWindows: () => (bindBaseUrl('/api/time-windows/')),
  patchTimeWindows: id => (bindBaseUrl(`/api/time-windows/${id}/`)),
};

// user
export const userApi = {
  getUser: id => bindBaseUrl(`/api/users/${id}/`),
};

// insulin
export const insulinApi = {
  getInsulins: bindBaseUrl('/api/insulins/'),
};

// diabetes settings TODO: remove id
export const diabetesSettingsApi = {
  getDiabetesSettings: diabetesId => (bindBaseUrl(`/api/diabetes-settings/${diabetesId}/`)),
};

// premade regimen API
export const premadeRegimenApi = {
  getPremadeRegimen: () => ('https://private-3a12d-trial38.apiary-mock.com/premaderegimen'),
};

// practitioner API
export const practitionerApi = {
  getTimeWindows: id => (bindBaseUrl(`/api/practitioner/patients/${id}/time-windows/`)),
  getBgReadings: ({ id, currentDate, previousCount, limit }) => {
    const startDate = currentDate.clone().subtract({ days: previousCount - (1 - limit) }).format('YYYY-MM-DDT00:00:00');
    const endDate = currentDate.clone().subtract({ days: previousCount }).format('YYYY-MM-DDT23:59:59');
    return bindBaseUrl(`/api/practitioner/patients/${id}/bg-readings/?min_log_datetime=${startDate}&max_log_datetime=${endDate}`);
  },
  getInsulinDoses: ({ id, currentDate, previousCount, limit }) => {
    const startDate = currentDate.clone().subtract({ days: previousCount - (1 - limit) }).format('YYYY-MM-DDT00:00:00');
    const endDate = currentDate.clone().subtract({ days: previousCount }).format('YYYY-MM-DDT23:59:59');
    return bindBaseUrl(`/api/practitioner/patients/${id}/insulin-doses/?min_log_datetime=${startDate}&max_log_datetime=${endDate}`);
  },
  getPatientList: (id) => {
    if (id) {
      return bindBaseUrl(`/api/practitioner/patients/${id}/`);
    } else { // eslint-disable-line
      return bindBaseUrl('/api/practitioner/patients/');
    }
  },
  getPractitioner: id => (bindBaseUrl(`/api/practitioners/${id}/`)),
  getPractitionerId: () => (bindBaseUrl('/api/practitioners/me/')),
  getMe: () => (bindBaseUrl('/auth/me/')),
  checkEmailPhone: () => (bindBaseUrl('/api/check-email-phone/')),
  onBoarding: () => (bindBaseUrl('/api/patient-onboarding/')),
};

export const getClinics = () => (bindBaseUrl('/api/locations/'));
export const getAllPractitioners = () => (bindBaseUrl('/api/practitioners/'));

/* HyperTension API */

export const hyperTension = {
  getHyperTensionSettings: id => (bindBaseUrl(`/api/hypertension-settings/${id}/`)),
  getBpReadings: (startDate, endDate, id) => (bindBaseUrl(`/api/practitioner/patients/${id}/bp-readings/?min_log_datetime=${startDate}&max_log_datetime=${endDate}`)),
  getMedicationDoses: (startDate, endDate, id) => (bindBaseUrl(`/api/practitioner/patients/${id}/medication-doses/?min_log_datetime=${startDate}&max_log_datetime=${endDate}`)),
  getMedications: () => (bindBaseUrl('/api/medications/')),
  timeWindows: () => (bindBaseUrl('/api/hypertension-time-windows/')),
  getRequiredMedicationDoses: id => bindBaseUrl(`/api/practitioner/patients/${id}/required-doses/`),
};

/* Reminders API */
export const reminders = {
  getReminders: patientId => (bindBaseUrl(`/api/practitioner/patients/${patientId}/reminders/`)),
  postReminders: patientId => (bindBaseUrl(`/api/practitioner/patients/${patientId}/reminders/`)),
  patchReminders: (patientId, reminderId) => (bindBaseUrl(`/api/practitioner/patients/${patientId}/reminders/${reminderId}/`)),
  deleteReminders: (patientId, reminderId) => (bindBaseUrl(`/api/practitioner/patients/${patientId}/reminders/${reminderId}/`)),
};
