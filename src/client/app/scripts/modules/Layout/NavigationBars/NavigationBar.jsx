import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import Modal from '../../Common/Presentational/Modal/index.jsx';
import ShowPreloader from '../../Common/Presentational/ShowPreloader.jsx';
import Button from '../../Common/FormElements/ReduxForm/Button/index.jsx';

import styles from './styles/index.scss';

const style = {
  buttonStyle: {
    position: 'absolute',
    bottom: '25px',
    right: '40px',
  },
  liStyle: {
    marginTop: '15px',
  }
};

const renderTabs = (tabs, activeId) => map(tabs, tab => (
  <div key={tab.id} className={classNames('tab', { active: (tab.id === activeId) })}>
    <div className="border-wrapper">
      <Link to={tab.link}>
        {tab.title}
      </Link>
    </div>
  </div>
));

const renderAddPrescriptionModal = (onAddHyperTension, onClose) => (
  <Modal bodyClass="add-prescription-modal" open onClose={onClose} height={200}>
    <div>
      <div>Do you want to add Hypertension to this patient ?</div>
      <ul style={style.ulStyle}>
        By doing this
        <li style={style.liStyle}> Hypertension would be added for this patient. </li>
        <li style={style.liStyle}> Hypertension includes Blood pressure and medication doses.</li>
      </ul>
      <div
        style={style.buttonStyle}
      >
        <Button
          onClick={onAddHyperTension}
          value="Add Prescription"
        />
      </div>
    </div>
  </Modal>
);

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldShowAddPrescriptionModal: false,
    };

    this.togglePrescriptionModal = this.togglePrescriptionModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isHavingHypertension !== nextProps.isHavingHypertension && nextProps.isHavingHypertension) {
      this.setState({
        shouldShowAddPrescriptionModal: !nextProps.isHavingHypertension,
      });
    }
  }

  togglePrescriptionModal() {
    this.setState({
      shouldShowAddPrescriptionModal: !this.state.shouldShowAddPrescriptionModal,
    });
  }

  render() {
    const plusButtonClass = this.props.tabs.length >= 3 ? 'btn-disabled' : '';
    const spanStyle = (this.props.location.pathname === '/') ? {
      display: 'none',
    } : null;
    return (
      <div className={classNames(styles['navigation-bar'], 'clearfix')}>
        <ShowPreloader show={this.props.isFetching}>
          {this.state.shouldShowAddPrescriptionModal && renderAddPrescriptionModal(this.props.onAddHyperTension, this.togglePrescriptionModal)}
          {renderTabs(this.props.tabs, this.props.activeId)}
        </ShowPreloader>
      </div>
    )
  }
}

NavigationBar.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeId: PropTypes.any.isRequired,
};

export default NavigationBar;
