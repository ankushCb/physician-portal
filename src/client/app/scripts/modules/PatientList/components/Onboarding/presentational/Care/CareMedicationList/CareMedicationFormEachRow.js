import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form/immutable';
import cx from 'classnames';
import PropTypes from 'prop-types';

import TypeableSelect from '../../../../../../Common/FormElements/ReduxForm/TypeableSelect';
import InputDecimal from '../../../../../../Common/FormElements/ReduxForm/InputDecimal';
import Button from '../../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import InputText from '../../../../../../Common/FormElements/ReduxForm/InputText';

import {
  frequencyOptions,
  medicationOptions,
} from '../mockData';

import styles from './styles.scss';

// input overwriting styles
const inputStyles = disabled => ({
  border: disabled ? 'none' : '1px solid #d9d9d9',
});

// Dropdown style for med name
const dropDownStyle = {
  width: '100%',
  height: '250px',
};

// Dose unit style to be overwritten
const doseUnitStyles = disabled => ({
  border: disabled ? 'none' : '1px solid #d9d9d9',
  boxSizing: 'border-box',
  width: '50px',
  paddingLeft: '5px',
  textAlign: 'unset',
});

const CareMedicationFormEachRow = ({
  index,
  activeIndex,
  addableIndex,
  editableIndex,
  onClickAdd,
  onClickEdit,
  ...props
}) => {
  // Addable or editable index which is currently open for editing / adding
  const currentlyActiveIndex = (editableIndex !== -1) ? editableIndex : addableIndex;

  // if current row is disabled for editing
  const isDisabled = (currentlyActiveIndex !== index);

  // Edit or submit in edit mode
  const editOrSubmitLabel = editableIndex === index ? 'DONE' : 'EDIT';

  // Whether to disable other edit button during editing
  const editBtnDisabled = (isDisabled && editableIndex !== -1) || !props.isValid;

  const editOrSubmitLabelClass = editOrSubmitLabel === 'DONE' ? 'primary-button' : 'bordered-button';

  return (
    <Row className={cx(styles['care-input-row'], index === currentlyActiveIndex ? 'active' : '')}>
      <Col md={1} xs={1} className="index">
        {activeIndex}
      </Col>
      <Col className="care-input" md={3} xs={3}>
        <Field
          name={`row[${index}].medicationName`}
          dropDownOptions={medicationOptions}
          component={TypeableSelect}
          disabled={isDisabled}
          placeholder="Medication Name"
          dropDownStyle={dropDownStyle}
          inputStyle={inputStyles(isDisabled)}
          isAsync
          stackVertical
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
      </Col>
      <Col md={1} xs={1} className="care-input">
        <Field
          name={`row[${index}].medicationDose`}
          component={InputDecimal}
          displayOnly={isDisabled}
          inputStyle={doseUnitStyles(isDisabled)}
          placeholder="Dose"
          inputClass="focused-input"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
      </Col>
      <Col md={1} xs={1} className="care-input">
        <Field
          name={`row[${index}].unitName`}
          displayOnly={isDisabled}
          disabled={isDisabled}
          component={InputText}
          placeholder="Unit"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
      </Col>
      <Col md={3} xs={3} className="care-input frequency-select">
        <Field
          name={`row[${index}].frequencyName`}
          dropDownOptions={frequencyOptions}
          component={TypeableSelect}
          disabled={isDisabled}
          inputStyle={inputStyles(isDisabled)}
          placeholder="Frequency"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
      </Col>
      <Col md={3} xs={3}>
        {
            index === addableIndex ? (
              <div className="full-width">
                <Button
                  label="ADD"
                  className="primary-button"
                  onClick={onClickAdd}
                  disabled={isDisabled || !props.isValid}
                  id="add"
                />
              </div>
            ) : (
              <div className={editOrSubmitLabel !== 'EDIT' ? 'full-width' : 'half-width'}>
                <Button
                  label={editOrSubmitLabel}
                  className={editOrSubmitLabelClass}
                  onClick={onClickEdit(index, editOrSubmitLabel)}
                  disabled={editBtnDisabled}
                  id="edit"
                />
                {
                  editOrSubmitLabel !== 'EDIT' ? (
                    null
                  ) : (
                    <Button
                      label="X"
                      className={editBtnDisabled ? 'inverted-button' : 'bordered-button'}
                      onClick={onClickEdit(index, 'DELETE')}
                      disabled={editableIndex === index || !props.isValid}
                    />
                  )
                }
                
              </div>
            )
          }
      </Col>
    </Row>
  );
};

CareMedicationFormEachRow.propTypes = {
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  addableIndex: PropTypes.number.isRequired,
  editableIndex: PropTypes.number.isRequired,
  onClickAdd: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default CareMedicationFormEachRow;
