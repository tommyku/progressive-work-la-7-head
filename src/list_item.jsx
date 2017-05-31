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
  userSelect: 'none'
};

const TodoRemoveBoxStyle = Object.assign(
  {color: '#f66'},
  TodoDoneBase
);

const TodoTextStyle = {
  color: '#990',
  wordBreak: 'break-word'
};

const TodoItemStyle = {
  clear: 'both',
  marginBottom: '0.25em'
};

const TodoOperationBoxStyle = {
  float: 'right',
  userSelect: 'none'
};

const ListItem = (props, context)=> {
  const {
    list,
    style,
    ...others
  } = props;

  const { update } = context;

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

  const handleRemoveBoxClick = (e)=> {
    const displayName = `${list.displayName.substring(0, 32)}${(list.displayName.length > 32) ? '...' : ''}`;
    if (confirm(`真係要刪「${displayName}」？`)) {
      update('remove_list', {key: list.key});
    }
  }

  const RemoveBox = (
    <button style={TodoRemoveBoxStyle}
      onClick={handleRemoveBoxClick}
      className='hover-pointer'>
      刪
    </button>
  );

  const OperationBox = (
    <span style={TodoOperationBoxStyle}>
      {RemoveBox}
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
      {OperationBox}
    </div>
  );
};

ListItem.contextTypes = {
  update: PropTypes.func
}

export default ListItem;
