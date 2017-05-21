import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
  padding: 0,
  fontSize: 'medium',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
};

const TodoTextStyle = {
  color: '#990',
  wordBreak: 'break-word'
};

const TodoItemStyle = {
  clear: 'both',
  marginBottom: '0.25em'
};

const ListItem = (props, context)=> {
  const {
    list,
    doneCount,
    undoneCount,
    style,
    ...others
  } = props;

  const DoneBox = (
    <span style={TodoDoneBase}
      className='hover-pointer'>
      列
    </span>
  );

  const TextBox = (
    <span style={TodoTextStyle}>
      <Link to={`/list/${list.key}`}>
        {list.displayName}
      </Link>
    </span>
  );

  const todoItemStyle = Object.assign(
    {},
    TodoItemStyle,
    style
  );

  return (
    <div style={todoItemStyle}>
      {DoneBox}
      {TextBox}
    </div>
  );
};

export default ListItem;
