import React from 'react'
import PropTypes from 'prop-types'

class EditItem extends React.Component {
  render() {
    const MoveOption = (props)=> {
      return (
        <option key={props.index} value={props.listKey}>{props.displayName}</option>
      );
    };

    const MoveItem = (
      <section>
        <select>
          {
            Object.keys(this.props.lists).map((key, index)=> {
              let displayName = this.props.lists[key];
              return MoveOption({index: index, listKey: key, displayName: displayName});
            })
          }
        </select>
      </section>
    );

    const EditText = (
      <section>
        {'edit text'}
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

EditItem.contexTypes = {
  update: PropTypes.func
};

export default EditItem;
