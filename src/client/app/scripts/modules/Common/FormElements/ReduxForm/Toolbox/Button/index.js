import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button/Button';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import theme from './theme.scss';

const divStyle = {
  marginTop: '-10px',
  display: 'inline-block',
  marginLeft: '20px',
}
const ToolboxButton = ({ isWorking, disabled, label, ...props }) => {
  return (
    <React.Fragment>
      <Button
        {...props}
        label={isWorking ? <ProgressBar type="circular" mode="indeterminate" /> : label}
        theme={theme}
        disabled={isWorking || disabled}
      >
        {props.rightSideElement}
      </Button>
    </React.Fragment>
  );
};

ToolboxButton.propTypes = {
  rightSideElement: PropTypes.boolean,
};

ToolboxButton.defaultProps = {
  rightSideElement: false,
};

export default ToolboxButton;
