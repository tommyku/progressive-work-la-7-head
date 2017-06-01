import React, { Component } from 'react'
import AutoLinkText from 'react-autolink-text2'
import PropTypes from 'prop-types'
import Todo from './data/todo.js'

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
  width: '100%',
  boxSizing: 'border-box'
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

const ToggleDetailsModeStyle = Object.assign(
  {},
  TodoSubmitButtonStyle,
  {
    backgroundColor: '#999',
    color: '#000',
    padding: '0 .25em',
    marginLeft: '.5em',
    fontSize: 'medium'
  }
);

const TodoShowDetailsStyle = {
  backgroundColor: '#000',
  color: '#999',
  fontFamily: 'monospace',
  wordSpacing: '0',
  padding: '2px',
  wordWrap: 'break-word',
  fontSize: 'medium',
  margin: '.5em 0',
  width: '100%',
  whiteSpace: 'pre-wrap',
  overflowX: 'auto',
  boxSizing: 'border-box'
};

class EditItem extends Component {
  constructor(props) {
    super(props);
    const {item} = this.props;
    this.state = {
      text: item ? item.text : '',
      details: item ? item.details : '',
      mode: this.modes.EDIT
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleTextareaChange(e) {
    this.setState({details: e.target.value});
  }

  render() {
    const {
      lists,
      listKey,
      item,
      ...other
    } = this.props;

    const { update, listOrders } = this.context;

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
      let text = this.state.text.trim();
      if (text.length === 0) return;
      let details = this.state.details.trim();
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

    const handleToggleDetailsModeClick = ()=> {
      const newMode = (this.state.mode === this.modes.PREVIEW) ?
        this.modes.EDIT : this.modes.PREVIEW;
      this.setState({mode: newMode});
    };

    const MoveItem = (
      <section>
        <h3>移去第度</h3>
        <ul>
          {
            listOrders.map((key, index)=> {
              let displayName = lists[key].name;
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

    const EditDetails = (
      <textarea ref={ el => editDetails = el }
        style={TodoDetailsStyle}
        rows={15}
        onChange={this.handleTextareaChange}
        value={this.state.details} />
    );

    const ShowDetails = (
      <div style={TodoShowDetailsStyle}>
        <AutoLinkText text={this.state.details} />
      </div>
    );

    const ToggleDetailsMode = (
      <button style={ToggleDetailsModeStyle}
        onClick={handleToggleDetailsModeClick}>
        { this.state.mode === this.modes.PREVIEW ? '改' : '睇' }
      </button>
    );

    const EditText = (
      <section>
        <h3>
          <label htmlFor='edit-text'>
            { this.state.mode === this.modes.PREVIEW ? '睇' : '改' }內容
          </label>
          {ToggleDetailsMode}
        </h3>
        <input
          id='edit-text'
          ref={ el => editText = el }
          type='text'
          autocapitalize='none'
          onChange={this.handleTextChange}
          value={this.state.text}
          style={TodoTextStyle} />
        { this.state.mode === this.modes.PREVIEW && ShowDetails}
        { this.state.mode === this.modes.EDIT && EditDetails}
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
  listOrders: PropTypes.array
}

EditItem.prototype.modes = {
  PREVIEW: 'preview',
  EDIT: 'edit'
}

export default EditItem;
