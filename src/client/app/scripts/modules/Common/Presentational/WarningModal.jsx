import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal/index.jsx';
import { ModalWarningIcon } from '../../Common/Icon/index.jsx';
import Button from '../FormElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';

const ConfirmSaveModal = props => (
  <Modal
    open={props.showSaveConfirmModal}
    onClose={props.onClose}
    className={styles['warning-modal']}
    modalHeader={props.modalHeader}
  >
    <div className="icon-wrapper">
      <ModalWarningIcon />
    </div>
    <div className="content-wrapper">
      {props.children}
    </div>
    <div className="button-wrapper">
      {
        !props.disableSubmit ? (
          <Button
            onClick={props.onClose}
            className="inverted-button"
            label={props.cancelLabel}
          />
        ) : null
      }
      <Button
        disabled={props.disableSubmit}
        onClick={props.onConfirmSave}
        className="primary-button"
        label={props.submitLabel}
        isWorking={props.disableSubmit}
      />
    </div>
  </Modal>
);

ConfirmSaveModal.propTypes = {
  showSaveConfirmModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool,
  onConfirmSave: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  primaryClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ConfirmSaveModal.defaultProps = {
  disableSubmit: false,
  submitLabel: 'Submit',
  cancelLabel: 'Cancel',
  primaryClassName: 'primary-button',
};

export default ConfirmSaveModal;
