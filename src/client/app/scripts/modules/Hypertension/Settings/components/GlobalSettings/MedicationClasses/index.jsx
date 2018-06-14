import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, Field } from 'redux-form/immutable';

import isEqual from 'lodash/isEqual';
import map from 'lodash/map';

import { Row, Col } from 'react-flexbox-grid';

import MedicationClassInput from './MedicationClassInput.jsx';

import styles from './styles.scss';

class MedicationClasses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDelete: '',
    }
    this.handleHover = this.handleHover.bind(this);
    this.removeHover = this.removeHover.bind(this);
  }

  handleHover(activeDelete) {
    return () => {
      this.setState({
        activeDelete,
      });
    };
  }

  removeHover() {
    this.setState({
      activeDelete: '',
    });
  }

  render() {
    const { medicationClasses, handleSelectRegimenChange } = this.props;
    const medicationClassData = medicationClasses.toJS();
    return (
      <div className={styles['medication-classes']}>
        {
          map(medicationClassData, ({ required, ...mdClasses }, index) => {
            if (required) {
              return (
                  <Field
                    key={index}
                    name={`medicationClasses[${index}]`}
                    component={MedicationClassInput}
                    mdClassImmutable={mdClasses}
                    selectRegimenChangeHandler={handleSelectRegimenChange}
                    handleHover={this.handleHover}
                    activeDelete={this.state.activeDelete}
                    removeHover={this.removeHover}
                  />
              );
            }
            return null;
          })
        }
      </div>
    );   
  }
}

MedicationClasses.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default MedicationClasses;
