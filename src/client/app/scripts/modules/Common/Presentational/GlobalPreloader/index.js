import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Modal from '../Modal/index.jsx';

import styles from './styles.scss';

const Spinner = () => (
  <Modal open className="preloader-modal">
    <div className={styles['spinner']}>
      <div className="spinner-anim">
        <ProgressBar type="circular" mode="indeterminate" />
      </div>
      <div className="spinner-logging">
        Please wait ...
      </div>
      <div className="clearfix" />
    </div>
  </Modal>
);

export default Spinner;