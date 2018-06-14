import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import AppBar from 'react-toolbox/lib/app_bar/AppBar';

import ShowPreloader from 'scripts/modules/Common/Presentational/ShowPreloader.jsx';
import { LogoIcon } from '../../../Common/Icon/index.jsx';
import Logout from '../../../Common/Logout/index.jsx';



import theme from './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);

  }
  componentWillReceiveProps(nextProps) {
    // if (!this.props.redirectData.shouldRedirect && nextProps.redirectData.shouldRedirect) {
    //   window.location = `/${nextProps.redirectData.to}`;
    // }
  }

  handleClick(_e) {
    window.localStorage.removeItem('token');
    window.location = '/login';
  }

  render() {
    const { practitionerDetails: { name }, fetchingData } = this.props;
    return (
      <AppBar
        theme={theme}
      >   
        <span className="portal-icon">
          <Link to="/">
            <LogoIcon />
          </Link>
        </span>
        <span className="portal-name">
          Doctor {name}'s Portal
        </span>
        <span onClick={this.handleClick} className="logout">
          Log Out
        </span>
      </AppBar>
    );
  }
}

Header.propTypes = {
  fetchPractitionerDetails: PropTypes.func.isRequired,
  practitionerDetails: PropTypes.object,
  fetchingData: PropTypes.bool,
};

Header.defaultProps = {
  practitionerDetails: {},
  fetchingData: false,
};

export default Header;
