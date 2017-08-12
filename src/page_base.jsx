import React, { PureComponent } from 'react';
import AppBar from './components/app_bar.jsx';
import BottomBar from './components/bottom_bar.jsx';

const DefaultAppBar = (
  <AppBar
    homeName='要做的野'
    home='/' />
);

const DefaultBottomBar = (
  <BottomBar></BottomBar>
);

const PageBaseStyle = {
  paddingBottom: '20px'
};

class PageBase extends PureComponent {
  render(props) {
    return (
      <div style={PageBaseStyle}>
        { props.appBar || DefaultAppBar }
        { props.children }
        { props.bottomBar || DefaultBottomBar }
      </div>
    );
  }
}

export default PageBase;
