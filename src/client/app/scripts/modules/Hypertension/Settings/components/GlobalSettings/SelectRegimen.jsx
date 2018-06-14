import React, { Component } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import find from 'lodash/find';

import InputSelect from '../../../../Common/FormElements/Formsy/InputSelect';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';

const regimens = [
  {
    name: 'CHF-ACE',
    medications: [
      {
        class: 'BB',
      },
      {
        class: 'ACE',
      },
      {
        class: 'AA',
      },
    ],
  },
  {
    name: 'CHF-ARB',
    medications: [
      {
        class: 'BB',
      },
      {
        class: 'ACE',
      },
      {
        class: 'AA',
      },
    ],
  },
  {
    name: 'CAD-ACE',
    medications: [
      {
        class: 'BB',
      },
      {
        class: 'ACE',
      },
    ],
  },
  {
    name: 'CAD-ARB',
    medications: [
      {
        class: 'BB',
      },
      {
        class: 'ARB',
      },
    ],
  },

];

const style = {
  selectStyle: {
    width: '140px',
    backgroundColor: 'rgb(245, 245, 245)',
    border: '0.5px solid rgb(151, 151, 151)',
    color: 'rgb(77, 77, 78)',
    height: '2rem',
  },
  regimenStyle: {
    marginTop: '-5px',
  },
};
class SelectRegimen extends Component {
  constructor() {
    super();
    this.state = {
      activeRegimen: '',
    };
    this.handleRegimenChange = this.handleRegimenChange.bind(this);
  }

  handleRegimenChange(selectedRegimen) {
    this.setState({
      selectedRegimen,
    });
    this.props.onRegimenChange(find(regimens, { name: selectedRegimen }));
  }

  render() {
    const regimenOptions = map(map(regimens, 'name'), regimen => ({
      name: regimen,
      value: regimen,
    }));
    return (
      <div className="select-regimen">
        <div className="title">Regimen</div>
        <div className="select-regimen-select" style={style.regimenStyle}>
          <InputSelect
            options={regimenOptions}
            onChange={this.handleRegimenChange}
            value={this.state.selectedRegimen}
            dontError
          />
        </div>
        <span className="btn-wrapper">
          <Button
            label="Add class"
            className="primary-button"
            onClick={this.props.onAddClassClick}
          />
        </span>
      </div>
    );
  }
}

SelectRegimen.propTypes = {
  onRegimenChange: PropTypes.func.isRequired,
};

SelectRegimen.defaultProps = {

};

export default SelectRegimen;
