import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';

class FormWithSubmit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
    };
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.getModel = this.getModel.bind(this);
  }

  getModel() {
    return this.refs.form.getModel();
  }

  enableButton() {
    if (this.props.passValidation) {
      this.props.passValidation(true);
    }
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    if (this.props.passValidation) {
      this.props.passValidation(false);
    }
    this.setState({
      canSubmit: false,
    });
  }

  render() {
    return (
      <Formsy
        id={this.props.id}
        className={this.props.className}
        onValidSubmit={this.props.onSubmit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        ref="form"
    >
        {this.props.children}
        {
          this.props.shouldDisplayButton ? (<button
            className={this.props.buttonClass}
            type="submit"
            disabled={!this.state.canSubmit && this.props.buttonState}
          >
            <strong>{ this.props.buttonName}</strong>
          </button>) : null
        }
      </Formsy>
    );
  }
}

FormWithSubmit.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  buttonClass: PropTypes.string,
  buttonState: PropTypes.bool,
  buttonName: PropTypes.any,
  children: PropTypes.any.isRequired,
  shouldDisplayButton: PropTypes.bool,
  passValidation: PropTypes.func,
};

FormWithSubmit.defaultProps = {
  id: undefined,
  className: undefined,
  onValid: undefined,
  onInvalid: undefined,
  buttonClass: undefined,
  buttonState: undefined,
  shouldDisplayButton: true,
  onSubmit: () => {},
  buttonName: undefined,
  passValidation: () => {},
};

export default FormWithSubmit;
