import React from 'react';
import PropTypes from 'prop-types';
import PractitionerDetails from './PractitionerDetails/components/index.js';
import LayoutWrapper from './LayoutWrapper.jsx';

const LayoutWithPractitionerDetails = ({ children, location }) => (
  <div>
    <PractitionerDetails />
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  </div>
);

LayoutWithPractitionerDetails.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutWithPractitionerDetails;
