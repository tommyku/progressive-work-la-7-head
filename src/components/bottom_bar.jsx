import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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

const PersistenceIndicator = ({ persist })=> (
  <span style= { {
    marginRight: '1em',
    color: '#6f6',
    display: persist ? 'default' : 'none'
  } }>
    { persist ? '離線可用' : '' }
  </span>
);

const ConnectivityIndicator = ({ online })=> (
  <span style={ {
    marginRight: '1em',
    color: online ? '#6f6' : '#f66'
  } }>
    { online ? '\u263a 線上' : '\u2639 斷線' }
  </span>
);

const AvailabilityIndicator = ({status})=> {
  const COLORS = ['#ff6', '#990', '#090', '#999'];
  const DESCRIPTION = ['等陣', '改左', '用得', '準備緊'];
  return (
    <span style={ {
      marginRight: '1em',
      color: COLORS[status]
    } }>
      { DESCRIPTION[status] }
    </span>
  );
};

const FirstPullIndicator = ({status})=> {
  const COLORS = ['#ff6', '#090'];
  const DESCRIPTION = ['未拉', '拉左'];
  const index = status ? 1 : 0;
  return (
    <span style={ {
      marginRight: '1em',
      color: COLORS[index]
    } }>
      { DESCRIPTION[index] }
    </span>
  );
};

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
        <div name='bottom-bar-content' style={ BottomBarContentStyle }>
          <ConnectivityIndicator online={ this.context.getFlagData('ONLINE') }></ConnectivityIndicator>
          <AvailabilityIndicator status={ this.context.getFlagData('AVAIL') }></AvailabilityIndicator>
          <FirstPullIndicator status={ this.context.getFlagData('FPULL') }></FirstPullIndicator>
          <PersistenceIndicator status={ this.context.getFlagData('PERSIST') }></PersistenceIndicator>
          <Link to='/manage'
            style={ { textDecoration: 'none' } }>
            設定
          </Link>
        </div>
      </div>
    );
  }
}

BottomBar.contextTypes = {
  getFlagData: PropTypes.func
};

export default BottomBar;
