import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';

const buttonLoginStyle = {
  marginRight: '.5em',
  padding: 0,
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  color: '#ff6'
};

const inputFieldLabelStyle = {
  display: 'block'
};

const inputFieldInputStyle = {
  color: '#999',
  background: 'black',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: '.5em 0',
  width: '100%'
};

const inputFieldStyle = {
  marginBottom: '1em'
};

class LoginPage extends PureComponent {
  handleButtonLoginClick(e) {
    const payload = {
      host: this.refs['hoodieHost'].value || '',
      user: this.refs['hoodieUser'].value || '',
      pass: this.refs['hoodiePass'].value || '',
    };
    this.context.update('login', payload);
  }

  render() {
    const Header = (
      <h3>
        你要登入
      </h3>
    );

    const InputField = (props)=> {
      const { type, inputRef, id, label, placeholder } = props;
      return (
        <div style={inputFieldStyle}>
          <label htmlFor={id}
            style={inputFieldLabelStyle}>
            {label}
          </label>
          <input type={type}
            ref={el => this.refs[inputRef] = el}
            id={id}
            placeholder={placeholder}
            style={inputFieldInputStyle} />
        </div>
      );
    };

    const inputForm = (
      <div>
        <InputField type='url'
          inputRef='hoodieHost'
          label='Hoodie條Link'
          placeholder='e.g. https://hoodie.what.ever' />
        <InputField type='text'
          inputRef='hoodieUser'
          label='Hoodie用戶名'
          placeholder='e.g. 我' />
        <InputField type='password'
          inputRef='hoodiePass'
          label='Hoodie密碼'
          placeholder='e.g. 1+1=咩' />
      </div>
    );

    const buttonLogin = (
      <button type='button'
        style={buttonLoginStyle}
        onClick={(e)=> this.handleButtonLoginClick(e)}>
        登入
      </button>
    );

    return (
      <section>
        {Header}
        {inputForm}
        {buttonLogin}
      </section>
    );
  }
}

LoginPage.contextTypes = {
  update: PropTypes.func,
}

export default LoginPage;
