import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import capitalize from 'lodash/capitalize';
import map from 'lodash/map';

import InputSelect from '../../../../Common/FormElements/InputSelect';

import styles from './styles.scss';

const MealSelectionPanel = ({ availableMeals, startTime, endTime, ...props }) => (
  <div className={styles['meal-selection-panel']}>
    <Row between="xs">
      <Col sm={2}>
        <InputSelect
          options={map(availableMeals, meal => ({ value: meal, name: capitalize(meal) }))}
          onChangeInput={props.onMealChange}
          style={{ fontSize: '12px' }}
        />
      </Col>
    </Row>
  </div>
);

MealSelectionPanel.propTypes = {
  onMealChange: PropTypes.func.isRequired,
  showTimeRangeInput: PropTypes.bool.isRequired,
  availableMeals: PropTypes.array,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  onTimeChange: PropTypes.func,
};

MealSelectionPanel.defaultProps = {
  availableMeals: [],
  startTime: '',
  endTime: '',
  onTimeChange: () => {},
};

export default MealSelectionPanel;
