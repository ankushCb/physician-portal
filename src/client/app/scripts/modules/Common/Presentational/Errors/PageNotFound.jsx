import React from 'react';
import { Link } from 'react-router';

import styles from './styles/index.scss';

const PageNotFound = () => (
  <div className={styles['page-not-found']}>
    <div className="message">
      <p>
        Seems You have lost your way! Don&#39;t worry we&#39;ll help you out, Please click the link below
      </p>
      <Link to="/">
        Click here if you are lost
      </Link>
    </div>
  </div>
);

export default PageNotFound;
