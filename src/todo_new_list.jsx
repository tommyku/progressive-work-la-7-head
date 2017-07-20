import React from 'react';
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

const TodoTitleBoxStyle = {
  clear: 'both'
};

const TodoNewList = (props, context)=> {
  const {
    style
  } = props;

  const TitleBox = (
    <div style={TodoTitleBoxStyle}>改番個名（填名然後Enter）</div>
  );

  const AddBox = (
    <span style={TodoAddBase}>新</span>
  );

  const handleTextBoxKeyDown = (e)=> {
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      let text = e.target.value.trim();
      e.target.value = '';
      context.update('new_list', {key: props.listKey, name: text});
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
    <div>
      {TitleBox}
      <div style={todoItemStyle}>
        {AddBox}
        {TextBox}
      </div>
    </div>
  );
};

TodoNewList.contextTypes = {
  update: PropTypes.func
};

export default TodoNewList;
