import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import Immutable from 'immutable';

import FeatureCardWithHeader from '../../../Common/Presentational/FeatureCardWithHeader';
import GlobalSettings from './GlobalSettings/index.jsx';
import MedicationScheduleList from './MedicationScheduleList/index.jsx';

import styles from './styles.scss';

const selector = formValueSelector('hypertensionSettingsForm');

const toArray = list => Immutable.List.isList(list) && list.toArray();

const HypertensionSettingsForm = ({ medicationClasses, ...props }) => {
  return (
    <form>
      <div className={styles['hypertension-settings']}>
        <FeatureCardWithHeader
          header="Global Settings"
        >
          <GlobalSettings 
            selectRegimen={props.selectRegimen}
            handleSelectRegimenChange={props.handleSelectRegimenChange}
            onAddClassClick={props.onAddClassClick}
            addClassData={medicationClasses}
          />
        </FeatureCardWithHeader>

        {/* medication doses schedule */}
        <FeatureCardWithHeader header="Schedule" wrapperClass="hyp-settings-item">
          <MedicationScheduleList
            mealTimings={props.mealTimings}
            scheduleList={props.scheduleList}
            {...props}
          />
        </FeatureCardWithHeader>
      </div>
    </form>
  );
}

HypertensionSettingsForm.propTypes = {

};

HypertensionSettingsForm.defaultProps = {

};

export default connect(state => ({
  medicationClasses: selector(state, 'medicationClasses'),
  scheduleList: selector(state, 'scheduleList'),
}))(reduxForm({ form: 'hypertensionSettingsForm' })(HypertensionSettingsForm));
