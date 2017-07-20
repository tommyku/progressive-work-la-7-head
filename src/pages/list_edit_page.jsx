import React from 'react';
import PropTypes from 'prop-types';

const inputTextStyle = {
  color: '#999',
  background: 'black',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: '.5em 0',
  width: '100%'
};

const buttonSubmitStyle = {
  marginRight: '.5em',
  padding: 0,
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  color: '#ff6'
};

class ListEditPage extends React.Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      text: list ? list.name : '',
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  render() {
    const {
      listKey
    } = this.props;

    const { update } = this.context;

    // eslint-disable-next-line
    let editText;

    const handleTextEditClick = ()=> {
      let text = this.state.text.trim();
      if (text.length === 0) return;
      let redirectTo = '/';
      update('update_list', {
        key: listKey,
        name: text,
        redirectTo: redirectTo
      });
    };

    const EditText = (
      <section>
        <h3>
          <label htmlFor='edit-text'>改列名</label>
        </h3>
        <input
          id='edit-text'
          ref={ el => editText = el }
          type='text'
          autocapitalize='none'
          onChange={this.handleTextChange}
          value={this.state.text}
          style={inputTextStyle} />
        <button onClick={handleTextEditClick.bind(this)}
          style={buttonSubmitStyle}>
          改完
        </button>
      </section>
    );

    return (
      <div>
        {EditText}
      </div>
    );
  }
}

ListEditPage.contextTypes = {
  update: PropTypes.func,
};

export default ListEditPage;
