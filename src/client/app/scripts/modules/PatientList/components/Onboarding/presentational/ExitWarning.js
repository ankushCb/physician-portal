import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import { ModalWarningIcon } from '../../../../Common/Icon/index.jsx';

import styles from '../../styles.scss';

const ExitWarning = props => (
  <div className={styles['exit-warning']}>
    <div className="icon-wrapper">
      <ModalWarningIcon />
    </div>
    <div className="content-wrapper">
      <div className="warning-header">
        Are you sure you want to cancel ?
      </div>
      <div className="warning-content">
        This cannot be undone and you will lose all your entries.
      </div>
    </div>
    <div className="button-wrapper">
      {
        !props.disableSubmit ? (
          <Button
            onClick={props.rejectCancel}
            className="inverted-button"
            label="NO, DON'T CANCEL"
          />
        ) : null
      }
      <Button
        disabled={props.disableSubmit}
        onClick={props.onClose}
        className="warning-button"
        label="YES, CANCEL"
        isWorking={props.disableSubmit}
      />
    </div>
  </div>
);

ExitWarning.propTypes = {
  disableSubmit: PropTypes.bool.isRequired,
  rejectCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExitWarning;
