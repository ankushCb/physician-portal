import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Iterable } from 'immutable';

import LimitsEdit from './LimitsEdit.jsx';
import InsulinRegimen from './InsulinRegimen.jsx';
import CorrectionalInsulin from './CorrectionalInsulin.jsx';
import CarbCounting from './CarbCounting.jsx';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';

import styles from './styles.scss';

const GlobalSettings = (props) => {
  const diabetesThresholds = Iterable.isIterable(props.diabetesThresholds) ?
    props.diabetesThresholds.toJS() : {};
  const regimenData = Iterable.isIterable(props.regimenData) ? props.regimenData.toJS() : props.regimenData;
  const correctionalDetails = Iterable.isIterable(props.correctionalDetails) ? props.correctionalDetails.toJS() : props.correctionalDetails;
  const carbCountingDetails = Iterable.isIterable(props.carbCountingDetails) ? props.carbCountingDetails.toJS() : props.carbCountingDetails;

  return (
    <FeatureCardWithHeader
      header="Global Settings"
      wrapperClass="settings-item"
      style={{
        display: (props.showCCTable ? 'none' : 'initial'),
      }}
    >
      <div className={styles['global-settings']}>
        <Row>
          <Col xs={3} md={3}>
            <LimitsEdit
              limits={diabetesThresholds}
              correctionalDetails={correctionalDetails}
            />
          </Col>
          <Col xs={3} md={3}>
            <InsulinRegimen
              regimenData={regimenData}
              insulinList={props.insulinList}
              scheduleData={props.scheduleData}
              selectedInsulins={props.selectedInsulins}
              regimenValidationSelector={props.regimenValidationSelector}
              changeScheduleTableRow={props.changeScheduleTableRow}
            />
          </Col>
          <Col xs={3} md={3} className={!correctionalDetails.correctionalOn && 'card-disabled'}>
            <CorrectionalInsulin
              correctionalDetails={correctionalDetails}
              diabetesThresholds={diabetesThresholds}
              scheduleData={props.scheduleData}
              changeScheduleTableRow={props.changeScheduleTableRow}
            />
          </Col>
          <Col xs={3} md={3}>
            {
              regimenData.insulinRegimen &&
              regimenData.insulinRegimen.includes('carb_') &&
              <CarbCounting
                carbCountingDetails={carbCountingDetails}
                insulinList={props.insulinList}
                selectedInsulins={props.selectedInsulins}
                scheduleData={props.scheduleData}
              />
            }
          </Col>
        </Row>
      </div>
    </FeatureCardWithHeader>
  );
};

GlobalSettings.propTypes = {
  diabetesThresholds: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
  }).isRequired,
  regimenData: PropTypes.object,
  insulinList: PropTypes.arrayOf(PropTypes.object),
  correctionalDetails: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
    correctionalOn: PropTypes.bool,
  }),
  carbCountingDetails: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
  }),
  selectedInsulins: PropTypes.object,
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCCTable: PropTypes.bool,
  changeScheduleTableRow: PropTypes.func.isRequired,
};

GlobalSettings.defaultProps = {
  regimenData: {
    insulinRegimen: 'custom',
  },
  insulinList: [],
  correctionalDetails: {
    correctionalOn: false,
  },
  carbCountingDetails: {},
  selectedInsulins: {
    basal: '',
    bolus: '',
    mixed: '',
  },
  showCCTable: false,
};

export default GlobalSettings;
