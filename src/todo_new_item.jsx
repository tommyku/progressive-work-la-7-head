import React from 'react'

const TodoItemStyle = {
  clear: 'both',
  background: 'black',
  display: 'flex',
  flexDirection: 'row'
};

const TodoTextStyle = {
  color: '#fff',
  background: 'none',
  border: 'none',
  fontSize: 'x-large',
  padding: 0,
  margin: 0,
  width: '100%'
};

const TodoAddBase = {
  marginRight: '.5em',
  display: 'inline-block',
};

const TodoNewItem = (props)=> {
  const {
    placeholder,
    style,
    ...others
  } = props;

  const AddBox = (
    <span style={TodoAddBase}>加</span>
  );

  const TextBox = (
    <input
      type='text'
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

export default TodoNewItem;
