import React from 'react'
import AutoLinkText from 'react-autolink-text2'
import PropTypes from 'prop-types'
import TimeAgo from 'timeago-react'
import { Link } from 'react-router-dom'

const TodoDoneBase = {
  marginRight: '.5em',
  display: 'inline-block',
  padding: 0,
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  userSelect: 'none'
};

const TodoDoneStyle = Object.assign(
  {color: '#fff'},
  TodoDoneBase
);

const TodoNotDoneStyle = Object.assign(
  {color: '#f66'},
  TodoDoneBase
);

const TodoRejectedStyle = Object.assign(
  {color: '#999'},
  TodoDoneBase
);

const TodoDoingStyle = Object.assign(
  {color: '#090'},
  TodoDoneBase
);

const TodoRemoveBoxStyle = TodoNotDoneStyle;

const TodoModificationBoxStyle = Object.assign(
  {textDecoration: 'none'},
  TodoDoneStyle,
  {marginRight: '.25em'}
);

const TodoOperationBoxStyle = {
  float: 'right',
  userSelect: 'none'
};

const TodoTextStyle = {
  color: '#990',
  wordBreak: 'break-word'
};

const TodoDoneTextStyle = Object.assign(
  {textDecoration: 'line-through'},
  TodoTextStyle
);

const TodoDoingTextStyle = Object.assign(
  {},
  TodoTextStyle,
  {color: '#ff0'}
);

const TodoRejectedTextStyle = Object.assign(
  {textDecoration: 'line-through'},
  TodoTextStyle,
  {color: '#999'}
);

const TodoTimeStyle = {
  color: '#bbb',
  fontFamily: 'monospace',
  lineHeight: '1.42857',
  minWidth: '4.25em',
  display: 'inline-block',
  textAlign: 'right',
};

const DoingTextBoxStyle = Object.assign(
  {},
  TodoTimeStyle,
  {
    marginRight: '0',
    color: '#090'
  }
);

const TodoItemStyle = {
  clear: 'both',
  marginBottom: '0.25em'
};

const TodoItem = (props, context)=> {
  const {
    text,
    done,
    dropped,
    createdAt,
    startedAt,
    uuid,
    listKey,
    style,
    ...others
  } = props;

  const {
    update,
    history
  } = context;

  const handleDoneBoxClick = (e)=> {
    update('toggle', {uuid: uuid, key: listKey});
  }

  const handleRemoveBoxClick = (e)=> {
    const displayName = `${text.substring(0, 32)}${(text.length > 32) ? '...' : ''}`;
    if (confirm(`真係要刪「${displayName}」？`)) {
      update('remove', {uuid: uuid, key: listKey});
    }
  }

  const handleModificationBoxClick = (e)=> {
    history.push(`/list/${listKey}/item/${uuid}`)
  }

  const DoneBox = (
    <button style={[TodoDoneStyle, TodoDoingStyle, TodoNotDoneStyle, TodoRejectedStyle][done]}
      onClick={handleDoneBoxClick}
      className='hover-pointer'>
      {['未', '做', '完', '算'][done]}
    </button>
  );

  const ModificationBox = (
    <button style={TodoModificationBoxStyle}
      className='hover-pointer'
      onClick={handleModificationBoxClick}>
      改
    </button>
  );

  const RemoveBox = (
    <button style={TodoRemoveBoxStyle}
      onClick={handleRemoveBoxClick}
      className='hover-pointer'>
      刪
    </button>
  );

  const DoingTextBox = (
    <span style={DoingTextBoxStyle}>
      （<TimeAgo datetime={startedAt || (new Date()).toString()} locale='zh_TW' />開始）
    </span>
  );

  const TextBox = (
    <span style={[TodoTextStyle, TodoDoingTextStyle, TodoDoneTextStyle, TodoRejectedTextStyle][done]}
      className='hover-default'>
      <AutoLinkText text={text} />
      {done == 1 && startedAt && DoingTextBox}
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
    <span style={TodoTimeStyle}>
      <TimeAgo
        title={createdAt}
        datetime={createdAt}
        locale='zh_TW' />
    </span>
  );

  const OperationBox = (
    <span style={TodoOperationBoxStyle}>
      {ModificationBox}
      {RemoveBox}
      {TimeBox}
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

TodoItem.contextTypes = {
  update: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}

export default TodoItem;
