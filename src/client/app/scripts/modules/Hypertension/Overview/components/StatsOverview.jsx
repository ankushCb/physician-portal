import React from 'react';
import { shape, number } from 'prop-types';

import StatBarItem from '../../../Common/Presentational/StatBarItem.jsx';
import { StethoscopeIcon, VitalsIcon, MedsIcon } from '../../../Common/Icon/index.jsx';

import styles from './styles.scss';

const StatsOverview = ({ overview: { bpAvgAm, bpAvgPm, vitalsTwoWeekAvg, vitals, medications } }) => (
  <div className={styles['stats-overview']}>
    <div className="item">
      <StatBarItem
        highlight={4}
        boldNote="Vitals 2 Week Average"
        note={
          vitalsTwoWeekAvg &&
          <div><div>{`${vitalsTwoWeekAvg.systolic}/${vitalsTwoWeekAvg.diastolic}`}</div><div>{vitalsTwoWeekAvg.heartRate}</div></div>
        }
      />
    </div>
    <div className="item">
      <StatBarItem
        highlight={<StethoscopeIcon />}
        boldNote="PM BP Average"
        note={bpAvgAm && `${bpAvgAm.systolic}/${bpAvgAm.diastolic}`}
      />
    </div>
    <div className="item">
      <StatBarItem
        highlight={<StethoscopeIcon />}
        boldNote="AM BP Average"
        note={bpAvgPm && `${bpAvgPm.systolic}/${bpAvgPm.diastolic}`}
      />
    </div>
    <div className="item">
      <StatBarItem
        highlight={<VitalsIcon />}
        boldNote="Vitals"
        note={`${vitals}%`}
      />
    </div>
    <div className="item">
      <StatBarItem
        highlight={<MedsIcon />}
        boldNote="Medications"
        note={`${medications}%`}
      />
    </div>
  </div>
);

StatsOverview.propTypes = {
  overview: shape({
    bpAvgPm: shape({
      systolic: number.isRequired,
      diastolic: number.isRequired,
    }),
    bpAvgAm: shape({
      systolic: number.isRequired,
      diastolic: number.isRequired,
    }),
    vitals: number,
    medications: number,
    vitalsTwoWeekAvg: shape({
      systolic: number.isRequired,
      diastolic: number.isRequired,
      heartRate: number.isRequired,
    }),
  }).isRequired,
};

export default StatsOverview;
