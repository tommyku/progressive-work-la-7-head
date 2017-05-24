import React from 'react'
import PropTypes from 'prop-types'
import Todo from './data/todo.js'
import Textarea from 'react-textarea-autosize'

const MoveItemButtonBase = {
  padding: 0,
  color: '#999',
  fontSize: 'medium',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
};

const MoveItemButtonCanMove = MoveItemButtonBase;

const MoveItemButtonCannotMove = Object.assign(
  {},
  MoveItemButtonBase,
  {color: '#ff6'}
);

const TodoTextStyle = {
  color: '#999',
  background: 'black',
  border: 'none',
  fontSize: 'medium',
  padding: 0,
  margin: '.5em 0',
  width: '100%'
};

const TodoDetailsStyle = {
  color: '#999',
  background: 'black',
  border: 'none',
  fontSize: 'medium',
  margin: '.5em 0',
  resize: 'none',
  width: '100%'
};

const TodoSubmitButtonStyle = {
  marginRight: '.5em',
  padding: 0,
  fontSize: 'inherit',
  background: 'none',
  border: 'none',
  lineHeight: '1.42857',
  color: '#ff6'
};

class EditItem extends React.Component {
  render() {
    const {
      lists,
      listKey,
      item,
      ...other
    } = this.props;

    const { update } = this.context;

    let editText, editDetails;

    const handleMoveOptionClick = (e)=> {
      let from = listKey;
      let to = e.target.dataset.listKey;
      let uuid = item.uuid;
      let redirectTo = `/list/${to}/item/${uuid}`
      update('move', {
        from: from,
        to: to,
        uuid: uuid,
        redirectTo: redirectTo
      });
    };

    const handleTextEditClick = (e)=> {
      let text = editText.value.trim();
      if (text.length === 0) return;
      let details = editDetails.base.value.trim();
      let redirectTo = `/list/${listKey}`;
      update('update', {
        text: text,
        details: details,
        key: listKey,
        uuid: item.uuid,
        redirectTo: redirectTo
      });
    };

    const MoveOption = (props)=> {
      return (
        <li key={props.index}>
          <button className={(props.canMove) ? 'hover-pointer': ''}
            style={(props.canMove) ? MoveItemButtonCanMove : MoveItemButtonCannotMove}
            onClick={handleMoveOptionClick}
            data-list-key={props.listKey}
            disabled={!props.canMove}>
            {props.displayName}
            {!props.canMove && ' \u21d0 而家呢度'}
          </button>
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
        <h3>
          <label htmlFor='edit-text'>改內容</label>
        </h3>
        <input
          id='edit-text'
          ref={ el => editText = el }
          type='text'
          defaultValue={item ? item.text : ''}
          style={TodoTextStyle} />
        <Textarea ref={ el => editDetails = el }
          style={TodoDetailsStyle}
          minRows={3}
          maxRows={10}
          defaultValue={item.details || ''} />
        <button onClick={handleTextEditClick.bind(this)}
          style={TodoSubmitButtonStyle}>
          改完
        </button>
      </section>
    );

    return (
      <div>
        {MoveItem}
        {EditText}
      </div>
    );
  }
}

EditItem.contextTypes = {
  update: PropTypes.func,
}

export default EditItem;
