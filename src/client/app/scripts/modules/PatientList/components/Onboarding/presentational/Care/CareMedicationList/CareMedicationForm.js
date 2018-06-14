import React from 'react';

import { connect } from 'react-redux';
import { fromJS, Iterable } from 'immutable';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import { reduxForm, change } from 'redux-form/immutable';
import CareMedicationFormEachRow from './CareMedicationFormEachRow';
import Button from '../../../../../../Common/FormElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';

class CareMedicationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editableIndex: -1,
      addableIndex: 0,
    };

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.renderFormFields = this.renderFormFields.bind(this);
  }

  onChangeDataForIndex(index, {
    medicationName,
    medicationDose,
    unitName,
    frequencyName,
  }) {
    const {
      dispatch,
    } = this.props;

    const newField = fromJS({
      medicationName,
      medicationDose,
      unitName,
      frequencyName,
    });

    dispatch(change(
      'careMedicationForm',
      `row[${index}]`,
      newField,
    ));
  }

  onClickAdd() {
    // Use redux form to update value dyanmically
    this.onChangeDataForIndex(this.state.addableIndex + 1, {
      medicationName: '',
      medicationDose: '',
      unitName: '',
      frequencyName: '',
    });

    // Change the state appropriately
    this.setState(prevState => ({
      addableIndex: prevState.addableIndex + 1,
      editableIndex: -1,
    }));
  }

  onClickEdit(editableIndex, toDo) {
    return () => {
      if (toDo === 'DONE') {
        this.setState(() => ({
          editableIndex: -1,
        }));
      } else if (toDo === 'ADD') {
        this.onChangeDataForIndex(this.state.addableIndex, {
          medicationName: '',
          medicationDose: '',
          unitName: '',
          frequencyName: '',
        });
      } else if (toDo === 'EDIT') {
        this.setState(() => ({
          editableIndex,
        }));
      } else {
        this.props.dispatch(change(
          'careMedicationForm',
          `row[${editableIndex}]`,
          fromJS({}),
        ));
      }
    };
  }

  renderFormFields() {
    let activeIndex = 0;
    return map(this.props.formValues.toJS(), (formData, index) => {
      if (!isEmpty(formData)) {
        activeIndex += 1;
        return (
          <CareMedicationFormEachRow
            activeIndex={activeIndex}
            index={index}
            addableIndex={this.state.addableIndex}
            editableIndex={this.state.editableIndex}
            onClickAdd={this.onClickAdd}
            onClickEdit={this.onClickEdit}
            isValid={this.props.validations ? this.props.validations.getIn([index, 'isValid']) : false}
          />
        );
      }
      return null;
    });
  }

  render() {
    let renderingContent;
    if (!this.props.formValues ||
      !Iterable.isIterable(this.props.formValues) ||
      this.props.formValues.size <= 1) {
      renderingContent = (
        <CareMedicationFormEachRow
          index={this.state.addableIndex}
          activeIndex={1}
          addableIndex={this.state.addableIndex}
          editableIndex={this.state.editableIndex}
          onClickAdd={this.onClickAdd}
          onClickEdit={this.onClickEdit}
          isValid={this.props.validations ? this.props.validations.getIn([0, 'isValid']) : false}
        />
      );
    } else {
      renderingContent = this.renderFormFields();
    }
    return (
      <div className={styles['care-med-form-wrapper']}>
        <form
          style={{ height: '100%' }}
          onSubmit={this.props.handleSubmit}
        >
          {renderingContent}
          <div className="submit-button">
            {
              !(this.props.careStatus && this.props.careStatus.isPosting) ? (
                <Button
                  label="CANCEL"
                  className="inverted-button"
                  onClick={this.props.switchToCancelForm}
                  disabled={this.props.careStatus && this.props.careStatus.isPosting}
                />
              ) : null
            }
            <Button
              type="submit"
              className="primary-button"
              label="DONE"
              isWorking={this.props.careStatus && this.props.careStatus.isPosting}
              disabled={this.props.careStatus && this.props.careStatus.isPosting}
            />
          </div>
        </form>
      </div>
    );
  }
}

CareMedicationForm = reduxForm({  // eslint-disable-line
  form: 'careMedicationForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(CareMedicationForm);

CareMedicationForm = connect(state => ({ // eslint-disable-line
  formValues: state.getIn(['form', 'careMedicationForm', 'values', 'row']),
}))(CareMedicationForm);

CareMedicationForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  validations: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  careStatus: PropTypes.object.isRequired,
  switchToCancelForm: PropTypes.func.isRequired,
};

export default CareMedicationForm;
