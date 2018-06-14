import React from 'react';
import {
  shape,
  arrayOf,
  oneOfType,
  number,
  string,
  bool,
  func,
  object,
} from 'prop-types';

import map from 'lodash/map';
import moment from 'moment';

import LogBookTable from '../../../Common/Presentational/LogBook/index.jsx';
import Meds from '../../Common/Presentational/Meds.jsx';

const headers = [
  { title: '', colSpan: 1 },
  { title: 'AM', colSpan: 3 },
  { title: 'Lunch', colSpan: 3 },
  { title: 'PM', colSpan: 3 },
];
class LogBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startItem: moment().utc().startOf('day'),
      limit: 7,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRowCountChange = this.handleRowCountChange.bind(this);
  }

  handleDateChange(value) {
    const startItem = this.state.startItem.clone().subtract({ days: this.state.limit * value });
    this.setState({
      startItem,
    });
    this.props.newFetch(startItem, this.state.limit);
  }

  handleRowCountChange(name, limit) {
    this.setState({
      limit: parseInt(limit, 10),
    });
    this.props.newFetch(this.state.startItem, limit);
  }

  render() {
    const startItem = this.state.startItem.clone().format('DD/MM/YYYY');
    const endItem = moment(startItem, 'DD/MM/YYYY').clone().subtract({ days: this.state.limit - 1 }).format('DD/MM/YYYY');
    let invalidData = false;
    const logBookData = map(this.props.logBook, (log) => {
      if (!log.date) {
        invalidData = true;
        return {};
      }
      const {
        date,
        am: { bp: { systolic: amSystolic, diastolic: amDiastolic }, hr: amHr, meds: amMeds },
        lunch: { bp: { systolic: lunchSystolic, diastolic: lunchDiastolic }, hr: lunchHr, meds: lunchMeds },
        pm: { bp: { systolic: pmSystolic, diastolic: pmDiastolic }, hr: pmHr, meds: pmMeds },
      } = log;
      return [
        moment(date).format('MM/DD/YYYY'),
        `${amSystolic}/${amDiastolic}`, amHr, <Meds doseTaken={amMeds.doseTaken} totalDose={amMeds.totalDose} />,
        `${lunchSystolic}/${lunchDiastolic}`, lunchHr, <Meds doseTaken={lunchMeds.doseTaken} totalDose={lunchMeds.totalDose} />,
        `${pmSystolic}/${pmDiastolic}`, pmHr, <Meds doseTaken={pmMeds.doseTaken} totalDose={pmMeds.totalDose} />,
        // 'NnN/mM',
      ];
    });
    if (invalidData) {
      return (
        <div> Invalid Data </div>
      );
    }
    return (
      <div style={{ border: '1px solid #e2e2e2' }}>
        <LogBookTable
          logBookData={logBookData}
          headers={headers}
          startItem={endItem}
          endItem={startItem}
          onPageChange={this.handleDateChange}
          onRowCountChange={this.handleRowCountChange}
          limit={this.state.limit}
          logBookIsFetching={this.props.isRefetching}
          type="hypertension"
          hypertensionSettings={this.props.hypertensionSettings}
        />
      </div>
    );
  }
}

LogBook.propTypes = {
  logBook: arrayOf(shape({
    date: string.isRequired,
    am: shape({
      bp: shape({
        diastolic: oneOfType([number, string]).isRequired,
        systolic: oneOfType([number, string]).isRequired,
      }).isRequired,
      hr: oneOfType([number, string]).isRequired,
      meds: oneOfType([number, string]).isRequired,
    }).isRequired,
    pm: shape({
      bp: shape({
        diastolic: oneOfType([number, string]).isRequired,
        systolic: oneOfType([number, string]).isRequired,
      }).isRequired,
      hr: oneOfType([number, string]).isRequired,
      meds: oneOfType([number, string]).isRequired,
    }).isRequired,
  })).isRequired,
  newFetch: func.isRequired,
  isRefetching: bool,
  hypertensionSettings: object.isRequired,
};

LogBook.defaultProps = {
  isRefetching: false,
};

export default LogBook;
