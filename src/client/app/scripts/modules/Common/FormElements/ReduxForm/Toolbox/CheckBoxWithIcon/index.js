import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import InputCheckBox from '../../../Formsy/InputCheck';
import { PlusIcon } from '../../../../Icon/index.jsx';

import style from './theme.scss';

const renderIcon = (type) => {
  switch (type) {
    case 'plus':
      return <PlusIcon />;
    case 'tag':
      return <div className="tickmark" />;
    default:
      return null;
  }
};

function CheckBoxWithIcon({ type, ...props }) {
  return (
    <span
      className={classNames(
        style['tag-check-box'],
        { checked: props.input.value },
        { disabled: props.disabled },
        type,
      )}
    >
      <label htmlFor={props.name}>{renderIcon(type)}</label>
      <InputCheckBox
        wrapperClass="tag-check-input"
        {...props}
      />
    </span>
  );
}

CheckBoxWithIcon.propTypes = {
  type: PropTypes.oneOf([
    'plus',
    'tag',
  ]).isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

CheckBoxWithIcon.defaultProps = {
  disabled: false,
};

export default CheckBoxWithIcon;
