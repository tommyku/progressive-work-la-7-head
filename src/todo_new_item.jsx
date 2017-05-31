import React from 'react'
import PropTypes from 'prop-types'

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
  padding: '0 .25em',
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  backgroundColor: '#999'
};

const UtilityBarStyle = {
  textAlign: 'right'
};

class TodoNewItem extends React.PureComponent {
  render() {
    const {
      placeholder,
      listKey,
      style,
      ...others
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

    const handleSortButtonClick = (e)=> {
      update('sort', {key: listKey});
    }

    const TextBox = (
      <input
        id='new-task'
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

    const UtilityBar = (
      <span style={UtilityBarStyle}>
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
}

export default TodoNewItem;
