import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  switch (props.type) {
    case 'h1':
      return (<h1 className={props.className} >{props.content}</h1>);
    case 'h2':
      return (<h2 className={props.className} >{props.content}</h2>);
    case 'h3':
      return (<h3 className={props.className} >{props.content}</h3>);
    case 'h4':
      return (<h4 className={props.className} >{props.content}</h4>);
    case 'h5':
      return (<h5 className={props.className} >{props.content}</h5>);
    case 'h6':
      return (<h6 className={props.className} >{props.content}</h6>);
    default:
      return null;
  }
};

Header.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
};

Header.defaultProps = {
  className: undefined,
};

export default Header;
