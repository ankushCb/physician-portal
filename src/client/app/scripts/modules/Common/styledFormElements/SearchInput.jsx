import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import InputTextBox from '../FormElements/Formsy/SimpleInputText';
import { SearchIcon } from '../Icon/index.jsx';

import styles from './styles.scss';

const SearchInput = ({ wrapperClass, name, onChange, ...props }) => {
  const handleChange = (inputName, value) => {
    onChange(value);
  };

  return (
    <div className={classNames(styles['search-input'], wrapperClass)}>
      <div className="search-icon">
        <SearchIcon />
      </div>
      <InputTextBox
        name={`${name}-search-input`}
        onChangeInput={handleChange}
        wrapperClass="search-input-box"
        {...props}
      />
    </div>
  );
};

SearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  wrapperClass: PropTypes.string,
};

SearchInput.defaultProps = {
  onChange: () => {},
  wrapperClass: '',
};

export default SearchInput;
