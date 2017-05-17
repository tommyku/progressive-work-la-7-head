import React from 'react'
import PropTypes from 'prop-types'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
  padding: 0,
  fontSize: 'x-large',
  background: 'none',
  border: 'none',
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

const TodoTextStyle = {
  color: '#990',
};

const TodoTimeStyle = {
  color: '#bbb',
  fontFamily: 'monospace',
  float: 'right'
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

  const DoneBox = (
    <button style={(done ? TodoNotDoneStyle : TodoDoneStyle)}
      onClick={handleDoneBoxClick}>
      {(done ? '完' : '未')}
    </button>
  );

  const TextBox = (
    <span style={TodoTextStyle}>{text}</span>
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
    </div>
  );
};

TodoItem.contextTypes = {
  update: PropTypes.func
}

export default TodoItem;
