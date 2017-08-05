import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './todo_item.jsx';
import TodoNewItem from './todo_new_item.jsx';
import TodoNewList from './todo_new_list.jsx';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const TodoStyle = {
  marginBottom: '20px'
};

const TodoList = (props, context)=> {
  const {
    persisted,
    orders,
    listKey,
    showAll,
    style,
    values,
    ...other
  } = props;

  const SortableItem = SortableElement(({item, style})=> {
    const {
      text,
      done,
      createdAt,
      uuid,
      alertAt,
      ...other
    } = item;

    return (
      <TodoItem
        text={text}
        done={done}
        uuid={uuid}
        listKey={listKey}
        createdAt={createdAt}
        alertAt={alertAt}
        style={style}
        {...other}
      />
    );
  });

  const shouldShow = (uuid)=> (values[uuid].done <= 1 || showAll);

  const SortableList = SortableContainer(({values, orders})=> {
    return (
      <section>
        {(orders || []).map((item, index)=> (
          <SortableItem key={`item-${index}`}
            item={values[item]}
            disabled={!shouldShow(item)}
            style={{display: (shouldShow(item) ? 'block' : 'none')}}
            index={index} />
        ))}
      </section>
    );
  });

  const handleSortEnd = ({oldIndex, newIndex})=> {
    if (oldIndex !== newIndex) {
      // correct newIndex by subtracting # of hidden items
      let countsBeforeIndex = 0;
      if (oldIndex <= newIndex && !showAll && newIndex + 1 != orders.length) {
        for (let i = oldIndex + 1; i < newIndex; ++i) {
          countsBeforeIndex += shouldShow(orders[i]) ? 0 : 1;
        }
      }
      let newValues = arrayMove(orders, oldIndex, newIndex - countsBeforeIndex);
      context.update('reorder', {
        key: listKey,
        uuids: newValues
      });
    }
  };

  let todoStyle = Object.assign({}, TodoStyle, style);

  return (
    <section {...other} style={todoStyle}>
      {persisted && <TodoNewItem listKey={listKey} showAll={showAll} />}
      {!persisted && <TodoNewList listKey={listKey} />}
      <SortableList values={values}
        orders={orders}
        lockToContainerEdges={true}
        axis='y'
        pressDelay={300}
        helperClass='sorted'
        transitionDuration={0}
        onSortEnd={handleSortEnd}
        lockAxis='y' />
    </section>
  );
};

TodoList.contextTypes = {
  update: PropTypes.func
};

export default TodoList;
