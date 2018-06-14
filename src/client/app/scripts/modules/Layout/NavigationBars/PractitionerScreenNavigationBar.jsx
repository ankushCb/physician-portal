import React from 'react';

import NavigationBar from './NavigationBar.jsx';

const navigationTabs = [
  {
    id: 1,
    title: 'Patients',
    link: '/',
  },
];

const PractitionerScreeNavigationBar = (props) => (
  <NavigationBar
    activeId={1}
    tabs={navigationTabs}
    location={props.location}
  />
);

export default PractitionerScreeNavigationBar;
