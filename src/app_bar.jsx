import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const AppBarMinHeight = '40px';

const AppBarStyle = {
  backgroundColor: '#0c0a66',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  width: '100vw',
  minHeight: AppBarMinHeight,
  display: 'flex',
  alignItems: 'center'
}

const HomeLinkStyle = {
  textDecoration: 'none',
  color: '#ff6',
  padding: '0 0.5em'
};

const LocationLinkStyle = {
  textDecoration: 'none',
  color: '#fff',
  padding: '0 0.5em'
};

const AppBarPlaceholderStyle = {
  paddingTop: AppBarMinHeight,
  marginBottom: `calc(${AppBarMinHeight} / 2)`
};

const AppBar = ({locationName, location, home, homeName, style, extra, ...others})=> {
  const appBarStyle = Object.assign(
    {},
    AppBarStyle,
    style
  );

  const HomeLink = (
    <Link to={home}
       style={HomeLinkStyle}>
      {homeName}
    </Link>
  );

  const LocationLink = (
    <span>
      <span style={{padding: '0 0.5em'}}>{'\u203A'}</span>
      {
        (location && locationName) &&
        <Link to={location}
           style={LocationLinkStyle}>
          {locationName}
        </Link>
      }
    </span>
  );

  return (
    <div>
      <header
        style={appBarStyle}
        {...others}>
        {HomeLink}
        {(location && locationName) && LocationLink}
        {extra}
      </header>
      <div style={AppBarPlaceholderStyle}></div>
    </div>
  );
}


AppBar.propTypes = {
  home: PropTypes.string.isRequired,
  homeName: PropTypes.string.isRequired,
  locationName: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object,
  extra: PropTypes.node
};

export default AppBar;
