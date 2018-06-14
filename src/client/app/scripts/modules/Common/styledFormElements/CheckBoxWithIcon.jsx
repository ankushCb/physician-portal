import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SimpleInputCheck as InputCheckBox } from '../FormElements/Formsy';
import { ValidInputIcon, PlusIcon } from '../Icon/index.jsx';

import styles from './styles.scss';

// const style = {
//   labelStyle: {
//     display: 'inline-block',
//     width: '20px',
//     height: '20px',
//     paddingTop: '6px',
//     paddingLeft: '5px',
//     // backgroundColor: '#5480b6',
//     // color: '#ffffff',
//   }, 
//   iconStyle: {
//     fontSize: '12px',
//   },
//   spanStyle: {
//     display: 'block',
//     textAlign: 'center',
//     marginLeft: '-20px',
//     paddingTop: '5px',
//   }
// };

const renderIcon = (type) => {
  switch (type) {
    case 'plus':
      return (
        <PlusIcon
        />
      );
    case 'tag':
      return (
        <div className="tickmark" />
      );
    default:
      return null;
  }
};

class CheckBoxWithIcon extends React.Component {
  render(){
    const { type, ...props } = this.props;

    return (
      <span
        className={classNames(
          styles['tag-check-box'],
          { checked: props.value },
          { disabled: props.disabled },
          type,
        )}
      >
        <label htmlFor={props.name}>
          {renderIcon(type)}
        </label>
        <InputCheckBox
          {...props}
          
          wrapperClass="tag-check-input"
        />
      </span>
    );
  }
}

CheckBoxWithIcon.propTypes = {
  type: PropTypes.oneOf([
    'plus',
    'tag',
  ]).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  disabled: PropTypes.bool,
};

CheckBoxWithIcon.defaultProps = {
  value: false,
  disabled: false,
};

export default CheckBoxWithIcon;
