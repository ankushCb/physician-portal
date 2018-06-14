import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import indexOf from 'lodash/indexOf';

import CarbCountingDoseTable from './CarbCountingDoseTable.jsx';
import getCorrectionFactor from '../../../helpers/getCorrectionFactor';

import styles from './styles.scss';

const CarbCountingPrescription = (props) => {
  window.scrollTo(0, 0);
  const timeWindowsOrder = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];
  const timeWindows = sortBy(props.timeWindows, ({ name: windowName }) => indexOf(timeWindowsOrder, windowName));
  return (
    <div className={styles['carb-counting-prescription']}>
      <div className="body">
        <div className="heading">
          Carb Counting
          <div onClick={props.onClose} className="close-btn">
            Back to settings
          </div>
        </div>
        {
          map(timeWindows, timeWindow => (
            <CarbCountingDoseTable
              key={timeWindow.name}
              insulin={props.bolusInsulin}
              idInsulinMap={props.idInsulinMap}
              timeWindow={assign({ unitsInsulin: 1 }, timeWindow)}
              correctionFactor={getCorrectionFactor(timeWindow.correctionalInsulinOn, pick(props, props.correctionTargetParams))}
              glucoseRowsLimit={props.glucoseRowsLimit}
              {...omit(props, ['timeWindows', 'correctionFactor'])}
            />
          ))
        }
      </div>
    </div>
  );
};


CarbCountingPrescription.propTypes = {
  onClose: PropTypes.func.isRequired,
  timeWindows: PropTypes.array,
  glucoseRowsLimit: PropTypes.number.isRequired,
  negativeCorrectionalOn: PropTypes.bool.isRequired,
};

CarbCountingPrescription.defaultProps = {
  timeWindows: [],
};

export default CarbCountingPrescription;
