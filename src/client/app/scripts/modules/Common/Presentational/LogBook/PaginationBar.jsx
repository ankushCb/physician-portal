import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

import map from 'lodash/map';
import range from 'lodash/range';

import InputSelect from 'scripts/modules/Common/FormElements/Formsy/InputSelect';
// import Button from 'scripts/modules/Common/FormElements/ReduxForm/Button/index.jsx';

import styles from './styles.scss';

const rowCountOptions = map(range(1, 7 + 1), idx => ({ name: idx, value: idx }));

const PaginationBar = ({ onRowCountChange, startItem, endItem, onPageChange, limit }) => {
  const handlePageChange = frame => () => {
    // eslint-disable-next-line no-unused-expressions
    (frame === 'older' ? onPageChange(1) : onPageChange(-1));
  };

  return (
    <div className={classNames(styles['pagination-bar'])}>
      <span className="">Last</span>
      <InputSelect
        name="rowCount"
        value={limit}
        onChangeInput={onRowCountChange}
        options={rowCountOptions}
        wrapperClass="rows-input"
      />
      days&nbsp;&nbsp;&nbsp;
      <span>{moment(startItem, 'DD/MM/YYYY').format('M/D/YYYY')}</span>
      &nbsp;-&nbsp;
      <span>{moment(endItem, 'DD/MM/YYYY').format('M/D/YYYY')}</span>
      <span
        onClick={handlePageChange('older')}
        className="arrows"
      >&lt;</span>
      <span
        className="arrows"
        onClick={handlePageChange('newer')}
        disabled={moment(endItem, 'DD/MM/YYYY').isAfter(moment().utc().startOf('day'), 'day') || moment(endItem, 'DD/MM/YYYY').isSame(moment().utc().startOf('day'), 'day')}
      >&gt;</span>
    </div>
  );
};

PaginationBar.propTypes = {
  onRowCountChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  startItem: PropTypes.string.isRequired,
  endItem: PropTypes.string.isRequired,
};

export default PaginationBar;
