import React, { Component } from 'react';

import styles from './styles.scss';

class Logout extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(_e) {
    window.localStorage.removeItem('token');
    window.location = '/login';
  }

  render() {
    return (
      <div className={'logout-button'}>
        <button
          onClick={this.handleClick}
        >
          Log out
        </button>
      </div>
    );
  }
}

export default Logout;
