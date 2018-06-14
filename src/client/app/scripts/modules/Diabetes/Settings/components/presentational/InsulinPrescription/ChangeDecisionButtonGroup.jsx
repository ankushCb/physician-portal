import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';


const ChangeDecisionButtonGroup = props => (
  <div className={styles['change-decision-btn-group']}>
    <Button
      className="primary-button"
      label="Discard Changes"
      onClick={props.onClickDiscard}
      disabled={props.shouldDisableButton || props.regimenNotPresent}
    />
    <Button
      type="submit"
      className="primary-button"
      label="Save Changes"
      onClick={() => { props.onClickSave(props); }}
      disabled={props.shouldDisableButton || !props.shouldDisableSaveButton || props.regimenNotPresent}
    />
  </div>
);

ChangeDecisionButtonGroup.propTypes = {
  onClickSave: PropTypes.func.isRequired,
  onClickDiscard: PropTypes.func.isRequired,
  shouldDisableButton: PropTypes.bool,
  shouldDisableSaveButton: PropTypes.bool,
  regimenNotPresent: PropTypes.bool,
};

ChangeDecisionButtonGroup.defaultProps = {
  shouldDisableButton: false,
  shouldDisableSaveButton: false,
  regimenNotPresent: false,
};

export default ChangeDecisionButtonGroup;
