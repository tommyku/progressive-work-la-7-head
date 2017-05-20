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

const TodoNewItem = (props, context)=> {
  const {
    placeholder,
    listKey,
    style,
    ...others
  } = props;

  const AddBox = (
    <span style={TodoAddBase}>加</span>
  );

  const handleTextBoxKeyDown = (e)=> {
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      let text = e.target.value.trim();
      e.target.value = '';
      context.update('add', {text: text, key: listKey});
    }
  };

  const TextBox = (
    <input
      type='text'
      onKeyDown={handleTextBoxKeyDown}
      style={TodoTextStyle} />
  );

  const todoItemStyle = Object.assign(
    {},
    TodoItemStyle,
    style
  );

  return (
    <div style={todoItemStyle}>
      {AddBox}
      {TextBox}
    </div>
  );
};

TodoNewItem.contextTypes = {
  update: PropTypes.func
}

export default TodoNewItem;
