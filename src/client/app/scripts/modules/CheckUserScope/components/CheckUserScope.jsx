import React from 'react';
import isNull from 'lodash/isNull';
import classNames from 'classnames';

import styles from './styles.scss';
import GlobalPreloader from '../../Common/Presentational/GlobalPreloader';

class CheckUserScope extends React.Component {
  constructor(props) {
    super(props);


  }

  componentDidMount() {
    this.props.checkUserScope();
  }

  render() {
    const {
      props: {
        redirectionStatus: {
          shouldRedirect,
          to,
        }
      }
    } = this;
    if (isNull(shouldRedirect)) {
      return (
        <GlobalPreloader />
      )
    } else if (!shouldRedirect) {
      return (
        <div className={classNames(styles['check-user-scope'], 'app-wrapper')}>
          {this.props.children}
        </div>
      )
    } else if (shouldRedirect) {
      // console.log('should redirect ', shouldRedirect, to);
      window.location = `/${to}`;
      return (
        null
      );
    }
  }
}

export default CheckUserScope;
