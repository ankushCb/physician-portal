import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../Common/Presentational/Modal/index.jsx';
import Button from '../../../../Common/FinalDesignElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';

const style = {
  contentStyle: {
    marginTop: '40px',
  },
  submitButtonStyle: {
    position: 'absolute',
    bottom: '25px',
    right: '40px',
  }
};

const ConfirmSaveModal = props => (
  <div className={styles['confirm-diabetes-settings']}>
    <Modal
      open={props.showSaveConfirmModal}
      onClose={props.onClose}
      className="confirm-save-modal"
      modalHeader="Confirm Save"
    >
      <div style={style.contentStyle}>
        Saving will overwrite the stored settings for this patient.
        By clicking Save Changes, you confirm that you have completely reviewed the dosage table(s).
      </div>
      <div style={style.submitButtonStyle}>
        <Button
          // disabled={props.disableSubmit}
          onClick={props.onConfirmSave}
          className="primary-button"
          label="Save"
          // isWorking={props.disableSubmit}
        />
      </div>
    </Modal>
  </div>
);

ConfirmSaveModal.propTypes = {
  showSaveConfirmModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool,
  onConfirmSave: PropTypes.func.isRequired,
  onCancelConfirmSave: PropTypes.func.isRequired,
};

ConfirmSaveModal.defaultProps = {
  disableSubmit: false,
};

export default ConfirmSaveModal;
