import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import indexOf from 'lodash/indexOf';
import values from 'lodash/values';

import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import AddNewMealDirect from './AddNewMealDirect.jsx';

import styles from './styles.scss';

const MealChangeOption = props => (
  <div className={classNames(styles['meal-change-option'], 'clearfix')}>
    <div>
      <AddNewMealDirect
        disabled={props.isCarbCounting || props.insulinRegimen === ''}
        addNewMealDisplayData={props.addNewMealDisplayData}
        premadeRegimenUpdatePartialActionCreator={props.premadeRegimenUpdatePartialActionCreator}
        timeWindowDisplayUpdateActionCreator={props.timeWindowDisplayUpdateActionCreator}
        onRemovePremadeRegimen={props.onRemovePremadeRegimen}
      />
      {
        indexOf(values(props.activeSelectedTw), true) !== -1 ? (
          <Button
            label="Delete selected"
            className="error-button"
            onClick={props.onDeleteSelectedMeal}
            disabled={props.isCarbCounting || props.insulinRegimen === ''}
          />
        ) : null
      }
      
    </div>
  </div>
);

MealChangeOption.propTypes = {
  onAddNewMeal: PropTypes.func.isRequired,
  onDeleteSelectedMeal: PropTypes.func.isRequired,
  isCarbCounting: PropTypes.bool,
  insulinRegimen: PropTypes.string,
};

MealChangeOption.defaultProps = {
  isCarbCounting: false,
  insulinRegimen: '',
};

export default MealChangeOption;
