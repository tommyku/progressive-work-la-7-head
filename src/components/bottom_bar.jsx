import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AppBarMinHeight = '20px';

const BottomBarStyle = {
  backgroundColor: '#000000',
  position: 'fixed',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100vw',
  minHeight: AppBarMinHeight,
  display: 'flex',
  alignItems: 'center',
};

const BottomBarContentStyle = {
  margin: 'auto',
  padding: '0 0.5em',
  width: '100vw',
  maxWidth: '48em'
};

const ConnectivityIndicator = (props)=> (
  <span style={ {
    marginRight: '1em',
    color: props.online ? '#6f6' : '#f66'
  } }>
    { '\u25cf ' }
    { props.online ? '線上' : '斷線' }
  </span>
);

class BottomBar extends Component {
  render() {
    const { style, ...others } = this.props;
    const bottomBarStyle = {
      ...BottomBarStyle,
      style
    };

    return (
      <div name='bottom-bar' style={ bottomBarStyle }
        { ...others }>
        <div nema='bottom-bar-content' style={ BottomBarContentStyle }>
          <ConnectivityIndicator online={ this.context.getFlagData('ONLINE') }></ConnectivityIndicator>
        </div>
      </div>
    );
  }
}

BottomBar.contextTypes = {
  getFlagData: PropTypes.func
};

export default BottomBar;
