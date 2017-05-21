import React from 'react'
import PropTypes from 'prop-types'
import Todo from './data/todo.js'

const MoveItemButtonBase = {};

const MoveItemButtonCanMove = MoveItemButtonBase;

const MoveItemButtonCannotMove = Object.assign(
  {color: '#ff6'},
  MoveItemButtonBase
);

const TodoTextStyle = {
  color: '#999',
  background: 'black',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: 0,
  width: '100%'
};

const EditItem = (props, context)=> {
  const {
    lists,
    listKey,
    item,
    ...other
  } = props;

  const handleMoveOptionClick = (e)=> {
    let from = listKey;
    let to = e.target.dataset.listKey;
    let uuid = item.uuid;
    let redirectTo = `/list/${to}/item/${uuid}`
    context.update('move', {
      from: from,
      to: to,
      uuid: uuid,
      redirectTo: redirectTo
    });
  };

  const MoveOption = (props)=> {
    return (
      <li key={props.index}
        className={(props.canMove) ? 'hover-pointer': ''}
        style={(props.canMove) ? MoveItemButtonCanMove : MoveItemButtonCannotMove}
        onClick={handleMoveOptionClick}
        data-list-key={props.listKey}>
        {props.displayName}
        {!props.canMove && ' \u21d0 而家呢度'}
      </li>
    );
  };

  const MoveItem = (
    <section>
      <h3>移去第度</h3>
      <ul>
        {
          Object.keys(lists).map((key, index)=> {
            let displayName = lists[key];
            let canMove = listKey !== key;
            return MoveOption({
              index: index,
              canMove: canMove,
              listKey: key,
              displayName: displayName
            });
          })
        }
      </ul>
    </section>
  );

  const EditText = (
    <section>
      <h3>改內容</h3>
      <input
        type='text'
        defaultValue={item ? item.text : ''}
        style={TodoTextStyle} />
    </section>
  );

  return (
    <div>
      {MoveItem}
      {EditText}
    </div>
  );
}

EditItem.contextTypes = {
  update: PropTypes.func,
}

export default EditItem;
