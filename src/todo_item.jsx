import React from 'react'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
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

const TodoItem = (props)=> {
  const {
    text,
    done,
    createdAt,
    style,
    ...others
  } = props;

  const DoneBox = (
    <span style={(done ? TodoNotDoneStyle : TodoDoneStyle)}>
      {(done ? '完' : '未')}
    </span>
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

export default TodoItem;
