import React, { Component } from 'react';

const spinnerBaseStyle = {
  position: 'fixed',
  top: '0.5em',
  right: '0.5em',
  color: '#338',
  fontStyle: 'italic',
};

class Spinner extends Component {
  render() {
    const { visible } = this.props;
    const spinnerStyle = Object.assign(
      {},
      spinnerBaseStyle,
      {color: (visible ? '#338' : '#0c0a66')}
    );

    return (
      <span style={spinnerStyle}
        title='loading'
        onClick={()=>{alert(`built at ${buildNumber}`);}}>
        等陣
      </span>
    );
  }
}

export default Spinner;
