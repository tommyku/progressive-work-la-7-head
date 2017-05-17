import React from 'react';

const ProviderStyle = {
  backgroundColor: '#222222',
  color: '#ffffff',
  fontSize: 'medium',
  fontFamily: '"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif',
  lineHeight: '1.42857143',
  maxWidth: '48em',
  padding: '0 .5em',
  margin: 'auto'
}

const PageStyle = Object.assign(
  {
    padding: 0,
    margin: 0
  },
  ProviderStyle,
)

class Provider extends React.Component {
  componentWillMount() {
    for (let style in PageStyle) {
      document.body.style[style] = PageStyle[style];
    }
  }

  render() {
    const {
      style,
      ...other
    } = this.props;

    const providerStyle =
      Object.assign(
        {},
        ProviderStyle,
        style
      )

    const divProps = {
      style: providerStyle
    }

    return (
      <div
        {...other}
        {...divProps}>
        {this.props.children}
      </div>
    );
  }
}

export default Provider;
