import React from 'react';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import { DropdownIcon } from '../../../../../Common/Icon/index.jsx';

import styles from './styles.scss';

class AddNewMealDirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleOnClickMeal = this.handleOnClickMeal.bind(this);
    this.handleOnClickAddNewMeal = this.handleOnClickAddNewMeal.bind(this);
  }

  handleOnClickMeal(value) {
    return () => {
      this.setState({ displayDropDown: false });

      const {
        mealName,
        mealStartTime: startTime,
        mealStopTime: stopTime,
      } = value;

      this.props.premadeRegimenUpdatePartialActionCreator({
        mealName,
        value: 'bg',
      });
      this.props.timeWindowDisplayUpdateActionCreator({
        [mealName]: {
          name: mealName,
          bg_check_prescribed: true,
          bg_check_required: true,
          start_time: startTime,
          stop_time: stopTime,
        }
      })
      this.props.onRemovePremadeRegimen();
    }
  }

  handleOnClickAddNewMeal() {
    this.setState({
      displayDropDown: !this.state.displayDropDown,
    })
  }

  render() {
    return (
      <div className={styles['add-new-direct']}>
        <Button
          label="Add New Meal"
          className="primary-button"
          rightSideElement={<DropdownIcon />}
          onClick={this.handleOnClickAddNewMeal}
          disabled={this.props.disabled || isEmpty(this.props.addNewMealDisplayData)}
        />
        {
          this.state.displayDropDown ? (
            <div className="dropdown">
              {
                map(this.props.addNewMealDisplayData, (value, key) => (
                  <div className="each-meal" key={key} onClick={this.handleOnClickMeal(value)}>
                    {capitalize(key)}
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </div>
    )
  }
}

export default AddNewMealDirect;
