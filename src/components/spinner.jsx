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
      { color: '#338' }
    );

    const displayText = ()=> {
      if (loading) return '等陣';
      if (dirty) return '改左';
      if (!firstPull) return '用得';
      return '準備緊';
    };

    return (
      <span style={spinnerStyle}
        title='loading'
        onClick={()=>{alert(`built at ${buildNumber}`);}} // eslint-disable-line
      >
        { displayText() }
      </span>
    );
  }
}

export default Spinner;
