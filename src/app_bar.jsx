import React from 'react'
import PropTypes from 'prop-types'

const AppBarMinHeight = '40px';

const AppBarStyle = {
  backgroundColor: '#0c0a66',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  width: '100vw',
  minHeight: AppBarMinHeight
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

const AppBar = ({locationName, location, home, homeName, style, ...others})=> {
  const appBarStyle = Object.assign(
    {},
    AppBarStyle,
    style
  );

  const HomeLink = (
    <a href={home}
       style={HomeLinkStyle}>
      {homeName}
    </a>
  );

  const LocationLink = (
    <a href={location}
       style={LocationLinkStyle}>
      {locationName}
    </a>
  );

  return (
    <div>
      <header
        style={appBarStyle}
        {...others} >
        {HomeLink}
        <span style={{padding: '0 0.5em'}}>{'\u203A'}</span>
        {LocationLink}
      </header>
      <div style={AppBarPlaceholderStyle}></div>
    </div>
  );
}


AppBar.propTypes = {
   locationName: PropTypes.string.isRequired,
   location: PropTypes.string.isRequired,
   home: PropTypes.string.isRequired,
   homeName: PropTypes.string.isRequired,
   style: PropTypes.object
};

export default AppBar;