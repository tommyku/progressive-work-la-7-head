import React, { Component } from 'react';

const spinnerBaseStyle = {
  position: 'fixed',
  top: '0.5em',
  right: '0.5em',
  color: '#338',
  fontStyle: 'italic',
}

class Spinner extends Component {
  render() {
    const { visible } = this.props;
    const spinnerStyle = Object.assign(
      {},
      spinnerBaseStyle,
      {display: (visible ? 'inline-block' : 'none')}
    );

    return (
      <span style={spinnerStyle} title='loading'>等陣</span>
    );
  }
}

export default Spinner;
