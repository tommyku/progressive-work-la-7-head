import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from './todo_item.jsx'
import TodoNewItem from './todo_new_item.jsx'
import TodoNewList from './todo_new_list.jsx'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

const TodoStyle = {
  marginBottom: '20px'
};

const TodoList = (props, context)=> {
  const {
    persisted,
    listKey,
    style,
    values,
    ...other
  } = props;

  const SortableItem = SortableElement(({item})=> {
    const {
      text,
      done,
      createdAt,
      uuid,
      ...other
    } = item;

    return (
      <TodoItem
        text={text}
        done={done}
        uuid={uuid}
        listKey={listKey}
        createdAt={createdAt}
        {...other}
      />
    );
  });

  const SortableList = SortableContainer(({values})=> {
    return (
      <section>
        {values.map((item, index)=> (
          <SortableItem key={index} item={item} index={index} />
        ))}
      </section>
    );
  });

  const handleSortEnd = ({oldIndex, newIndex})=> {
    let newValues = arrayMove(values, oldIndex, newIndex);
    context.update('reorder', {
      key: listKey,
      uuids: newValues.map((item)=> {return item.uuid})
    });
  };

  let todoStyle = Object.assign({}, TodoStyle, style);

  return (
    <section {...other} style={todoStyle}>
      {persisted && <TodoNewItem listKey={listKey} />}
      {!persisted && <TodoNewList listKey={listKey} />}
      <SortableList values={values}
        axis='y'
        pressDelay={100}
        transitionDuration={0}
        onSortEnd={handleSortEnd}
        lockAxis='y' />
    </section>
  );
}

TodoList.contextTypes = {
  update: PropTypes.func
}

export default TodoList;
