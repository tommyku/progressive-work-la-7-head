import React from 'react';
import PropTypes from 'prop-types';

const TodoItemStyle = {
  clear: 'both',
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

const ListMomentum = (props, context)=> {
  const {
    style
  } = props;

  const { momentum } = context;

  const AddBox = (
    <label style={TodoAddBase}
      htmlFor='new-list'>
      量
    </label>
  );

  const TextBox = momentum === undefined ? (
    <span></span>
  ) : (
    <span style={TodoTextStyle}>
      {`未: ${momentum.created} `}
      {`做: ${momentum.doing} `}
      {`完: ${momentum.done} `}
      {`算: ${momentum.rejected} `}
    </span>
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

ListMomentum.contextTypes = {
  momentum: PropTypes.object
};

export default ListMomentum;
