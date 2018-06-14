import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialog from 'react-toolbox/lib/dialog/Dialog';

import theme from './styles.scss';

const Modal = (props) => (props.open ? (
  <Dialog
    className={props.className}
    theme={theme}
    active
    onEscKeyDown={props.onClose}
    onOverlayClick={!props.overlayBlock ? props.onClose : undefined}
    {...props}
  >
    {props.children}
  </Dialog>
) : null);

Modal.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

Modal.defaultProps = {
  open: false,
  onClose: () => {},
  children: null,
  width: 400,
  height: 400,
  leaveAnimation: 'zoom',
};

export default Modal;
