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

const ListNewList = (props, context)=> {
  const {
    placeholder,
    style,
    ...others
  } = props;

  const AddBox = (
    <label style={TodoAddBase}
      htmlFor='new-list'>
      新
    </label>
  );

  const handleTextBoxKeyDown = (e)=> {
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      let text = encodeURIComponent(e.target.value.trim());
      let redirectTo = `/list/${text}`
      context.history.push(redirectTo);
    }
  };

  const TextBox = (
    <input
      id='new-list'
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
      <div style={todoItemStyle}>
        {AddBox}
        {TextBox}
      </div>
    </div>
  );
};

ListNewList.contextTypes = {
  update: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  })
}

export default ListNewList;
