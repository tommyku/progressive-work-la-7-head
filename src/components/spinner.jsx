import React, { PureComponent } from 'react';

const spinnerBaseStyle = {
  position: 'fixed',
  top: '0.5em',
  right: '0.5em',
  color: '#338'
};

class Spinner extends PureComponent {
  render() {
    const { loading, dirty, firstPull } = this.props;
    const spinnerStyle = Object.assign(
      {},
      spinnerBaseStyle,
      { color: (loading || dirty || !firstPull ? '#338' : '#0c0a66') }
    );

    const displayText = ()=> {
      if (loading) return '等陣';
      if (dirty) return '改左';
      if (!firstPull) return '用得';
    }

    return (
      <span style={spinnerStyle}
        title='loading'
        onClick={()=>{alert(`built at ${buildNumber}`);}}>
        { displayText() }
      </span>
    );
  }
}

export default Spinner;
