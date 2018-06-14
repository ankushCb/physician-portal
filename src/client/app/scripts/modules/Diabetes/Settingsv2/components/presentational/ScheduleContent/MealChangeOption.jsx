import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { change } from 'redux-form/immutable';
import { fromJS } from 'immutable';

import findIndex from 'lodash/findIndex';

import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import AddNewMealDirect from './AddNewMealDirect.jsx';

import styles from './styles.scss';

class MealChangeOption extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDropDown: false,
    };

    this.onDeleteSelectedMeal = this.onDeleteSelectedMeal.bind(this);
    this.isMealSelected = this.isMealSelected.bind(this);
    this.handleOnClickMeal = this.handleOnClickMeal.bind(this);
    this.handleOnClickAddNewButton = this.handleOnClickAddNewButton.bind(this);
  }

  /**
  * In the patch data that we send to update the time window, bg_check_required
  * will be ON when any of bgCheckPrescribed, correctionalInsulinOn, insulin or
  * carbCountingOn is turned ON.
  * bgCheckPrescribed is based on the bG Check checkbox in the view
  * correctionalInsulinOn is based on + checkbox in schedule table view
  * There can be a row with bg check and correctional OFF but the row still exists.
  * Hence, we need to remove insulin.
  * Carb counting cannot be ON without correctional, hence when we send correctionalOn
  * to backend, it sets correctional On and in turn bg_check_required ON. Hence,
  * even this needs to be removed from the row.
  */
  onDeleteSelectedMeal() {
    this.props.scheduleTableData
      .forEach((row, i) => {
        if (row.checked) {
          const rowToDelete = {
            ...row,
            isDisplayed: false,
            checked: false,
            bgCheck: false,
            correctionalInsulinOn: false,
            carbCountingRatio: null,
            insulin: null,
          };
          this.props.changeScheduleTableRow(i, fromJS(rowToDelete));
        }
      });
    // turn off premade regimen
    this.props.turnOffPremadeRegimen(fromJS({
      ...this.props.regimenData,
      isPremadeRegimen: false,
      insulinRegimen: 'custom',
    }));
  }

  handleOnClickMeal(meal) {
    return () => {
      const mealIndex = findIndex(this.props.scheduleTableData, row => row.name === meal.name);
      // Close the menu
      this.handleOnClickAddNewButton();
      // Update form data
      const newRow = {
        ...this.props.scheduleTableData[mealIndex],
        bgCheck: true,
        isDisplayed: true,
        base_dose: 1,
        insulin: null,
      };
      this.props.changeScheduleTableRow(mealIndex, fromJS(newRow));
      // turn off premade regimen
      this.props.turnOffPremadeRegimen(fromJS({
        ...this.props.regimenData,
        isPremadeRegimen: false,
        insulinRegimen: 'custom',
      }));
    };
  }

  isMealSelected() {
    if (this.props.scheduleTableData) {
      return !(findIndex(this.props.scheduleTableData, row => row.checked) >= 0);
    }
    return false;
  }

  handleOnClickAddNewButton() {
    this.setState({ displayDropDown: !this.state.displayDropDown });
  }

  render() {
    return (
      <div className={classNames(styles['meal-change-option'], 'clearfix')}>
        <div>
          <AddNewMealDirect
            addNewMealDisplayData={this.props.scheduleTableData}
            regimenData={this.props.regimenData}
            handleOnClickAddNewButton={this.handleOnClickAddNewButton}
            handleOnClickMeal={this.handleOnClickMeal}
            displayDropDown={this.state.displayDropDown}
          />
          <Button
            label="Delete selected"
            className="error-button"
            onClick={this.onDeleteSelectedMeal}
            disabled={this.isMealSelected()}
          />
        </div>
      </div>
    );
  }
}

MealChangeOption.propTypes = {
  scheduleTableData: PropTypes.array.isRequired,
  turnOffPremadeRegimen: PropTypes.func.isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
  regimenData: PropTypes.object.isRequired,
};

MealChangeOption.defaultProps = {
  isCarbCounting: false,
  insulinRegimen: '',
};

export default MealChangeOption;
