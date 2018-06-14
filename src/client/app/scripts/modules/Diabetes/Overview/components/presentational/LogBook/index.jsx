import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import pick from 'lodash/pick';
import toArray from 'lodash/toArray';

import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';
import LogBookTable from '../../../../../Common/Presentational/LogBook/index.jsx';
import List from '../../../../../Common/Presentational/List.jsx';

const pickValuesToArray = (...args) => obj => toArray(pick(obj, args));

const colSpan = 2;
const getHeaders = headerData => concat([{ title: 'Date', colSpan: 1 }], map(headerData, title => ({ title: capitalize(title), colSpan })));

const getFormattedDate = date => moment(date, 'DD-MM-YYYY').format('MM-DD-YYYY');
const getFormattedLogBookData = logBookData => map(logBookData, ({ date, timeWindows }) => {
  const values = flatten(map(timeWindows, pickValuesToArray('glucose', 'insulin')));
  return [
    getFormattedDate(date),
    ...values,
  ];
});

const LogBook = ({ logBookHeader, logBookData, hypo, goal, hyper, ...props }) => (
  <FeatureCardWithHeader
    header="Log book"
    showPreLoader={props.showPreLoader}
    wrapperClass="diabetes-display-item"
    sideElementType="linkButton"
    linkTo={`patients/${props.patientId}/settings`}
    buttonValue="Write prescription"
  >
    <List itemList={logBookHeader} noItemMessage="No Logs" showBorder>
      <LogBookTable
        type="diabetes"
        headers={getHeaders(logBookHeader)}
        logBookData={getFormattedLogBookData(logBookData)}
        onRowCountChange={props.onRowCountChange}
        onPageChange={props.onPageChange}
        startItem={props.startItem}
        endItem={props.endItem}
        logBookIsFetching={props.logBookIsFetching}
        limit={props.limit}
        wrapperClass="diabetes-display-log-book-table"
        hypo={hypo}
        goal={goal}
        hyper={hyper}
      />
    </List>
  </FeatureCardWithHeader>
);

LogBook.propTypes = {
  endItem: PropTypes.string.isRequired,
  startItem: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowCountChange: PropTypes.func.isRequired,
  logBookHeader: PropTypes.array,
  logBookData: PropTypes.array,
  showPreLoader: PropTypes.bool,
  logBookIsFetching: PropTypes.bool,
};

LogBook.defaultProps = {
  logBookHeader: [],
  logBookData: [],
  showPreLoader: false,
  logBookIsFetching: false,
};

export default LogBook;
