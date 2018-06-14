import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';
import List from 'scripts/modules/Common/Presentational/List.jsx';

import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';
import { getTimeInSimpleFormat } from '../../../../../../helpers/time.js';

import styles from './styles.scss';

const getYesOrNo = value => (value ? true : false);

const ScheduleHeader = () => (
  <div className="schedule-header row-wrapper">
    <Row>
      <Col md={2} className="content-header" xs>
        Meals
      </Col>
      <Col md={3} className="content-header" xs>
        Time
      </Col>
      <Col md={3} className="content-header" xs>
        Insulin
      </Col>
      <Col md={2} className="content-header bg" xs>
        bG
      </Col>
      <Col md={2} className="content-header" xs>
        Correction
      </Col>
    </Row>
  </div>
);

const Schedule = (props) => {
  return (
    <FeatureCardWithHeader
      header="Schedule"
      showPreLoader={props.showPreLoader}
    >
      <div className={styles.schedule}>
        <ScheduleHeader />
        <List itemList={props.scheduleDisplayData} noItemMessage="No Schedules">
          {
            map(props.scheduleDisplayData, (data) => {
              return (
                <div key={data.name} className="row-wrapper">
                  <Row className="each-row">
                    <Col sm={2} xs>
                      <div className="time-window-name left-align">
                        {capitalize(data.name)}
                      </div>
                    </Col>
                    <Col sm={3} xs>  
                      <div className="duration left-align">
                        {getTimeInSimpleFormat(data.startTime)}
                        &nbsp;-&nbsp;
                        {getTimeInSimpleFormat(data.stopTime)}
                      </div>
                    </Col>
                    {
                      !data.carbCountingOn ? (
                        <Col sm={3} xs className="left-align">
                          { data.baseDose && data.insulin ? `${data.baseDose} Unit of ${data.insulin}` : 0 }
                        </Col>
                      ) : (
                        <Col sm={3} xs className="left-align">
                          { data.carbCountingRatio && data.insulin ? `Carb Counting [${data.carbCountingRatio} : 1]` : 0 }
                        </Col>
                      )
                    }
                    <Col sm={2} xs>
                      {data.bgCheckPrescribed ? (
                        <div className="tickmark" />
                      ) : null}
                    </Col>
                    <Col sm={2} xs>
                      {data.correctionalInsulinOn ? (
                        <div>+</div>
                      ) : null}
                    </Col>
                  </Row>
                </div>
              );
            })
          }
        </List>
      </div>
    </FeatureCardWithHeader>
  );
  
}

Schedule.propTypes = {
  scheduleDisplayData: PropTypes.array,
  showPreLoader: PropTypes.bool,
};

Schedule.defaultProps = {
  scheduleDisplayData: [],
  showPreLoader: false,
};

export default Schedule;
