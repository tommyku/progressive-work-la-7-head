import React from 'react'
import AutoLinkText from 'react-autolink-text2'
import PropTypes from 'prop-types'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
  padding: 0,
  fontSize: 'medium',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
};

const TodoDoneStyle = Object.assign(
  {color: '#fff'},
  TodoDoneBase
);

const TodoNotDoneStyle = Object.assign(
  {color: '#f66'},
  TodoDoneBase
);

const TodoRemoveBoxStyle = TodoNotDoneStyle;

const TodoOperationBoxStyle = {float: 'right'};

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
  fontSize: 'medium',
  float: 'right',
  lineHeight: '1.42857'
};

const TodoItemStyle = {
  clear: 'both',
  marginBottom: '0.25em'
};

const TodoItem = (props, context)=> {
  const {
    text,
    done,
    createdAt,
    uuid,
    listKey,
    style,
    ...others
  } = props;

  const handleDoneBoxClick = (e)=> {
    context.update('toggle', {uuid: uuid, key: listKey});
  }

  const handleRemoveBoxClick = (e)=> {
    context.update('remove', {uuid: uuid, key: listKey});
  }

  const DoneBox = (
    <button style={(done ? TodoNotDoneStyle : TodoDoneStyle)}
      onClick={handleDoneBoxClick}
      className='hover-pointer'>
      {(done ? '完' : '未')}
    </button>
  );

  const RemoveBox = (
    <button style={TodoRemoveBoxStyle}
      onClick={handleRemoveBoxClick}
      className='hover-pointer'>
      刪
    </button>
  );

  const TextBox = (
    <span style={(done ? TodoDoneTextStyle : TodoTextStyle)}>
      <AutoLinkText text={text} />
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
      {TimeBox}
      {OperationBox}
    </div>
  );
};

TodoItem.contextTypes = {
  update: PropTypes.func
}

export default TodoItem;
