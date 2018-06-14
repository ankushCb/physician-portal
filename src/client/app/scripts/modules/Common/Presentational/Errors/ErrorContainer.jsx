import React from 'react';
import PropTypes from 'prop-types';

import SomethingWentWrong from './SomethingWentWrong.jsx';
import PageNotFound from './PageNotFound.jsx';

import styles from './styles/index.scss';

const ErrorContainer = ({ headerMessage, errorMessage }) => {
  // const childrenWithErrorMessage = React.Children.map(children, child =>
  //   React.cloneElement(child, { errorMessage: errorMessage }));

  return (
    <div className={styles['error-container']}>
      <div className={'header-message'}>
        <h2>{headerMessage}</h2>
      </div>

      <div className={'children-wrapper'}>
        { errorMessage == 'page-not-found' ? <PageNotFound /> : errorMessage}
      </div>
      {/* {childrenWithErrorMessage} */}
    </div>
  );
};

ErrorContainer.propTypes = {
  headerMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  children: PropTypes.node,
};

ErrorContainer.defaultProps = {
  headerMessage: 'Error !',
  errorMessage: '',
};

export default ErrorContainer;
