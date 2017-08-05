import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ButtonBaseStyle = {
  marginRight: '.5em',
  padding: '0 .5em',
  fontSize: 'inherit',
  background: '#ff6',
  border: 'none',
  lineHeight: '1.42857',
  color: '#000'
};

const SectionBaseStyle = {
  marginBottom: '1em'
};

const TextBoxBaseStyle = {
  backgroundColor: 'black',
  color: '#999',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: 0,
  lineHeight: '1.42857'
};

const Section = (props)=> {
  const { style, ...others } = props;
  return (
    <section {...others}
      style={Object.assign({}, SectionBaseStyle, style)}>
      {props.children}
    </section>
  );
};

const Button = (props)=> {
  const { style, ...others } = props;
  return (
    <button {...others}
      style={Object.assign({}, ButtonBaseStyle, style)}>
      {props.children}
    </button>
  );
};

const SignOutSection = (props)=> (
  <Section>
    <Button onClick={props.onClick}>
      登出
    </Button>
  </Section>
);

const DumpDataSection = (props)=> (
  <Section>
    <Button onClick={props.onClick}>
      匯出到JSON
    </Button>
  </Section>
);

class ManagePage extends Component {
  constructor(props) {
    super(props);
    this.handleSignOutButtonClick = this.handleSignOutButtonClick.bind(this);
    this.handleDumpDataButtonClick = this.handleDumpDataButtonClick.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
  }

  handleDumpDataButtonClick() {
    this.context.manage('dump_data');
  }

  handleSignOutButtonClick() {
    if (confirm('認真？未上傳資料會無曬架！')) {
      this.context.manage('logout');
    }
  }

  handleSearchButtonClick() {
    const value = this.refs['input'].value;
    if (!value || value.length == 0) return;
    this.context.history.replace(`/search/${value}`)
  }

  render() {
    const SearchSection = (props)=> (
      <Section>
        <input type='text' style={TextBoxBaseStyle} ref={(input)=> this.refs['input'] = input} />
        <Button onClick={props.onClick}>
          搵
        </Button>
      </Section>
    );

    return (
      <div>
        <SearchSection onClick={this.handleSearchButtonClick} />
        <DumpDataSection onClick={this.handleDumpDataButtonClick} />
        <SignOutSection onClick={this.handleSignOutButtonClick} />
      </div>
    );
  }
}

ManagePage.contextTypes = {
  manage: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  })
};

export default ManagePage;
