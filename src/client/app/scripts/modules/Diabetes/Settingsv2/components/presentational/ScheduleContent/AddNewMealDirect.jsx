import React from 'react';
import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';

import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import { DropdownIcon } from '../../../../../Common/Icon/index.jsx';
import styles from './styles.scss';

class AddNewMealDirect extends React.Component {
  render() {
    return (
      <div className={styles['add-new-direct']}>
        <Button
          label="Add New Meal"
          className="primary-button"
          rightSideElement={<DropdownIcon />}
          onClick={this.props.handleOnClickAddNewButton}
          disabled={findIndex(this.props.addNewMealDisplayData, ({ isDisplayed }) => (!isDisplayed)) === -1}
        />
        {
          this.props.displayDropDown ? (
            <div className="dropdown">
              {
                this.props.addNewMealDisplayData
                  .filter(meal => !meal.isDisplayed)
                  .map(meal => (
                    <div className="each-meal" key={meal.name} onClick={this.props.handleOnClickMeal(meal)}>
                      {meal.name}
                    </div>
                  ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

AddNewMealDirect.propTypes = {
  addNewMealDisplayData: PropTypes.array.isRequired,
  handleOnClickMeal: PropTypes.func,
};

AddNewMealDirect.defaultProps = {
  handleOnClickMeal: () => {},
};

export default AddNewMealDirect;
