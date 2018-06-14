import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import NavigationBar from './NavigationBar.jsx';


const getNavigationTabs = (patientId, isHavingHypertension) => {
  const routeLinks = [
    {
      id: 1,
      title: 'Diabetes',
      link: `/patients/${patientId}/diabetes`,
    },
    {
      id: 2,
      title: 'Hypertension',
      link: `/patients/${patientId}/hypertension`,
    },
    {
      id: 3,
      title: 'Reminders',
      link: `/patients/${patientId}/reminders`,
    },
    {
      id: 4,
      title: 'Mealtimes',
      link: `/patients/${patientId}/mealtimes`,
    }
  ];
  return sortBy(routeLinks, ({ id }) => (id));
};

const activeIdMap = {
  diabetes: 1,
  settings: 1,
  hypertension: 2,
  hypertension_settings: 2,
  reminders: 3,
  reminders_edit: 3,
  mealtimes: 4,
};

const PatientScreenNavigationBar = ({ patientId, currentRoute, isHavingHypertension, onAddHyperTension, isFetching, ...props }) => (
  <NavigationBar
    tabs={getNavigationTabs(patientId, isHavingHypertension)}
    activeId={activeIdMap[currentRoute]}
    patientId={patientId}
    onAddHyperTension={onAddHyperTension}
    isHavingHypertension={isHavingHypertension}
    isFetching={isFetching}
    location={location}
  />
);

PatientScreenNavigationBar.propTypes = {
  patientId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  currentRoute: PropTypes.string.isRequired,
  isHavingHypertension: PropTypes.bool,
  onAddHyperTension: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
};

PatientScreenNavigationBar.defaultProps = {
  isFetching: false,
  isHavingHypertension: false,
};

export default PatientScreenNavigationBar;
