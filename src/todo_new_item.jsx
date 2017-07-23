import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TodoItemStyle = {
  clear: 'both',
  background: 'black',
  display: 'flex',
  flexDirection: 'row'
};

const TodoTextStyle = {
  color: '#999',
  background: 'none',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: 0,
  width: '100%'
};

const TodoAddBase = {
  color: '#999',
  marginRight: '.5em',
  display: 'inline-block',
};

const SortButtonStyle = {
  display: 'inline-block',
  padding: '0 .25em',
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  backgroundColor: '#ff0'
};

const ShowAllButtonStyle = Object.assign(
  {},
  SortButtonStyle,
  {backgroundColor: '#999'}
);

const UtilityBarStyle = {
  display: 'flex',
  textAlign: 'right'
};

class TodoNewItem extends Component {
  constructor(props) {
    super(props);
    this.handleWindowKeypress = this.handleWindowKeypress.bind(this);
  }

  handleWindowKeypress() {
    if (document.activeElement !== this.refs['newTask'])
      this.refs['newTask'].focus();
  }

  componentWillMount() {
    window.addEventListener('keypress', this.handleWindowKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleWindowKeypress);
  }

  render() {
    const {
      placeholder,
      listKey,
      showAll,
      style
    } = this.props;

    const {update} = this.context;

    const AddBox = (
      <label style={TodoAddBase}
        htmlFor='new-task'>
        加
      </label>
    );

    const handleTextBoxKeyDown = (e)=> {
      if (e.key === 'Enter' && e.target.value.trim().length > 0) {
        let text = e.target.value.trim();
        e.target.value = '';
        update('add', {text: text, key: listKey});
      }
    };

    const handleSortButtonClick = ()=> {
      update('sort', {key: listKey});
    };

    const handleShowAllButtonClick = ()=> {
      update('toggle_showall', {key: listKey});
    };

    const TextBox = (
      <input
        id='new-task'
        ref='newTask'
        type='text'
        placeholder={placeholder}
        autocapitalize='none'
        onKeyDown={handleTextBoxKeyDown}
        style={TodoTextStyle} />
    );

    const todoItemStyle = Object.assign(
      {},
      TodoItemStyle,
      style
    );

    const SortButton = (
      <button style={SortButtonStyle}
        onClick={handleSortButtonClick}>
        排
      </button>
    );

    const ShowAllButton = (
      <button style={ShowAllButtonStyle}
        onClick={handleShowAllButtonClick}>
        {showAll ? '全' : '半'}
      </button>
    );

    const UtilityBar = (
      <span style={UtilityBarStyle}>
        {ShowAllButton}
        {SortButton}
      </span>
    );

    return (
      <div style={todoItemStyle}>
        {AddBox}
        {TextBox}
        {UtilityBar}
      </div>
    );
  }
}

TodoNewItem.contextTypes = {
  update: PropTypes.func
};

export default TodoNewItem;
