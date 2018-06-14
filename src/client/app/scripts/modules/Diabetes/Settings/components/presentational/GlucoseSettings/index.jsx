import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import find from 'lodash/find';

import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';
import { getIdFromUrl } from '../../../helpers/getInsulin.js';
import CorrectionalInsulin from './CorrectionalInsulin.jsx';
import InsulinRegimen from './InsulinRegimen.jsx';
import CarbCounting from './CarbCounting.jsx';
import LimitsEdit from './LimitsEdit.jsx';

import styles from './styles.scss';

const correctionalInsulinProps = [
  'correctionTarget',
  'correctionalOn',
  'correctionFactor',
  'correctionIncrement',
  'hypoglycemiaGlucoseThresholdMild',
  'onChangeInDiabetesSettings',
  'insulinRegimen',
  'allowNegativeCorrectional',
  'negativeCorrectionalOn',
];

const limitsEditProps = [
  'hyperglycemiaThresholdEmergency',
  'hyperglycemiaTitrationThresholdSmall',
  'hypoglycemiaGlucoseThresholdMild',
  'onChangeInDiabetesSettings',
];

const insulinRegimenProps = [
  'insulins',
  'basalInsulin',
  'bolusInsulin',
  'mixedInsulin',
  'insulinRegimen',
  'onChangeInDiabetesSettings',
  'premadeRegimenCriteria',
];

const carbCountingProps = [
  'carbCountingTimeWindows',
  'onChangeFormInput',
  'allowNegativeCorrectional',
];

const GlucoseSettings = (props) => {
  const renderCorrectional = () => (
    <CorrectionalInsulin
      {...pick(props, correctionalInsulinProps)}
      isFieldDisabled={!props.correctionalOn}
    />
  );

  const renderCarbCounting = () => {
    const bolusInsulin = find(props.insulins, { value: getIdFromUrl(props.bolusInsulin) }) || {};
    return (
      <CarbCounting
        bolusInsulin={bolusInsulin.name}
        {...pick(props, carbCountingProps)}
        isFieldDisabled={!props.insulinRegimen.includes('carb_counting')}
      />
    );
  };

  return !props.carbModalOpen && (
    <FeatureCardWithHeader
      header="Global Settings"
      wrapperClass="settings-item"
      showPreLoader={props.shouldLoadSpinner}
    >
      <div className={styles['global-settings']}>
        <Row>
          <Col xs={3} md={3}>
            <LimitsEdit {...pick(props, limitsEditProps)} />
          </Col>
          <Col xs={3} md={3}>
            <InsulinRegimen {...pick(props, insulinRegimenProps)} />
          </Col>
          <Col xs={3} md={3} className={!props.correctionalOn ? 'card-disabled' : undefined}>
            {renderCorrectional()}
          </Col>
          <Col xs={3} md={3}>
            {props.insulinRegimen.includes('carb_counting') ? renderCarbCounting() : null}
          </Col>
        </Row>
      </div>
    </FeatureCardWithHeader>
  );
};

GlucoseSettings.propTypes = {
  insulinRegimen: PropTypes.string,
  bolusInsulin: PropTypes.string, // eslint-disable-line
  insulins: PropTypes.array, // eslint-disable-line
  shouldLoadSpinner: PropTypes.bool,
};

GlucoseSettings.defaultProps = {
  insulinRegimen: '',
  insulins: [],
  bolusInsulin: '',
  shouldLoadSpinner: false,
};

export default GlucoseSettings;
