import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import map from 'lodash/map';
import times from 'lodash/times';

import PaginationBar from './PaginationBar.jsx';
import ColoredBg from '../ColoredBg.jsx';

import styles from './styles.scss';
import ShowPreLoader from '../ShowPreloader.jsx';

const getCategoryClass = (index, logCells, hypo, goal, hyper) => {
  if (index % 2 === 0 || logCells === '-') {
    return 'normal';
  } else if (logCells < hypo) {
    return 'lt-hypo';
  } else if (logCells >= goal && logCells < hyper) {
    return 'gt-goal';
  } else if (logCells >= hyper) {
    return 'gt-hyper';
  }
  return 'normal';
};

const getHypertensionClass = (index, logCells, settings) => {
  const sysHypo = settings.hypotensionSystolicThreshold;
  const sysHyper = settings.hypertensionSystolicThreshold;
  const diaHypo = settings.hypotensionDiastolicThreshold;
  const diaHyper = settings.hypertensionDiastolicThreshold;
  const sysGoal = settings.hypertensionThresholdMild;
  const diaGoal = settings.hypotensionThreshold;
  if (index % 3 === 1) {
    const splitLogs = logCells.split('/');
    const sysClass = getCategoryClass(1, parseInt(splitLogs[0], 10), sysHypo, sysGoal, sysHyper);
    const diaClass = getCategoryClass(1, parseInt(splitLogs[1], 10), diaHypo, diaGoal, diaHyper);
    return (sysClass !== 'normal') ? sysClass : diaClass;
  }
  return 'normal';
};

const LogBookTable = ({ headers, logBookData, hypo, goal, hyper, type, hypertensionSettings, ...props }) => {
  const tableHeaders = map(headers, ({ title, colSpan }) => <th colSpan={colSpan} key={title}>{title}</th>);

  const renderLogBookData = () => map(logBookData, (logRows, index) => (
    <tr key={index}>
      {map(logRows, (logCells, i) => {
        return (
          <td key={i}>
            <ColoredBg
              value={logCells}
              type={
                type !== 'hypertension' ? getCategoryClass(i, logCells, hypo, goal, hyper) :
                getHypertensionClass(i, logCells, hypertensionSettings)
              }
            />
          </td>
        )
      })}
    </tr>
  ));

  const renderCustomHeader = () => {
    let headerContent;
    if (type === 'diabetes') {
      const totalLength = logBookData[0] ? (logBookData[0].length-1) / 2 : 0;
      headerContent = times(totalLength, (data, index) => {
        return (
          <React.Fragment key={index}>
            <td className="sub-header">
              GLU
            </td>
            <td className="sub-header">
              INS
            </td>
          </React.Fragment>
        )
      });
    } else {
      headerContent = times(3, () => (
        <React.Fragment>
          <td className="sub-header">
            SYS/DIA
          </td>
          <td className="sub-header">
            HR
          </td>
          <td className="sub-header">
            MEDS
          </td>
        </React.Fragment>
        )
      )
    }

    return (
      <tr>
        <td></td>
        {headerContent}
      </tr>
    )
  }

  return (
    <div className={classNames(styles['log-book-table'], props.wrapperClass, 'clearfix')}>
      <ShowPreLoader show={props.logBookIsFetching} wrapperClass="log-book-pre-loader">
        <div className="table">
          <table>
            <thead>
              <tr>{tableHeaders}</tr>
            </thead>
            <tbody>
              {renderCustomHeader()}
              {renderLogBookData()}
            </tbody>
          </table>
        </div>
      </ShowPreLoader>
      <PaginationBar
        onRowCountChange={props.onRowCountChange}
        startItem={props.startItem}
        endItem={props.endItem}
        onPageChange={props.onPageChange}
        limit={props.limit}
      />
    </div>
  );
};
LogBookTable.propTypes = {
  onRowCountChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  startItem: PropTypes.string.isRequired,
  endItem: PropTypes.string.isRequired,
  logBookData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  logBookIsFetching: PropTypes.bool,
  wrapperClass: PropTypes.string,
  limit: PropTypes.number,
};

LogBookTable.defaultProps = {
  logBookData: [],
  logBookIsFetching: false,
  wrapperClass: '',
  limit: 7,
};

export default LogBookTable;
