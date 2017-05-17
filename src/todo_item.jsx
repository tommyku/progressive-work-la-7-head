import React from 'react'
import PropTypes from 'prop-types'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
  padding: 0,
  fontSize: 'x-large',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857'
};

const TodoDoneStyle = Object.assign(
  {},
  TodoDoneBase,
  {color: '#fff'}
);

const TodoNotDoneStyle = Object.assign(
  {},
  TodoDoneBase,
  {color: '#f66'}
);

const TodoRemoveBoxStyle = Object.assign(
  {float: 'right'},
  TodoNotDoneStyle
);

const TodoTextStyle = {
  color: '#990',
};

const TodoDoneTextStyle = Object.assign(
  {textDecoration: 'line-through'},
  TodoTextStyle
);

const TodoTimeStyle = {
  color: '#bbb',
  fontFamily: 'monospace',
  fontSize: 'x-large',
  float: 'right',
  lineHeight: '1.42857'
};

const TodoItemStyle = {
  clear: 'both'
};

const TodoItem = (props, context)=> {
  const {
    text,
    done,
    createdAt,
    uuid,
    style,
    ...others
  } = props;

  const handleDoneBoxClick = (e)=> {
    context.update('toggle', {uuid: uuid});
  }

  const handleRemoveBoxClick = (e)=> {
    context.update('remove', {uuid: uuid});
  }

  const DoneBox = (
    <button style={(done ? TodoNotDoneStyle : TodoDoneStyle)}
      onClick={handleDoneBoxClick}>
      {(done ? '完' : '未')}
    </button>
  );

  const RemoveBox = (
    <button style={TodoRemoveBoxStyle}
      onClick={handleRemoveBoxClick}>
      刪
    </button>
  );

  const TextBox = (
    <span style={(done ? TodoDoneTextStyle : TodoTextStyle)}>
      {text}
    </span>
  );

  const lo = (num)=> {
    return num < 10 ? `0${num}` : num.toString()
  }

  const humanizedTime = (createdAt)=> {
    let date = new Date(createdAt);
    return `${lo(date.getDate()+1)}/${lo(date.getMonth()+1)} ${lo(date.getHours())}:${lo(date.getMinutes())}`;
  }

  const TimeBox = (
    <time style={TodoTimeStyle}>{humanizedTime(createdAt)}</time>
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
      {TimeBox}
      {RemoveBox}
    </div>
  );
};

TodoItem.contextTypes = {
  update: PropTypes.func
}

export default TodoItem;
