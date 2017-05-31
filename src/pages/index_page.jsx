import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ListNewList from '../list_new_list.jsx'
import ListItem from '../list_item.jsx'
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

const IndexPage = (props, context)=> {
  const {
    lists,
    orders,
    ...others
  } = props;

  const { update } = context;

  const SortableItem = SortableElement(({list})=> {
    return (
      <ListItem list={list} />
    );
  });

  const ItemList = SortableContainer(({lists, orders})=> (
    <div>
      {(orders || []).map((key, index)=> (
        <SortableItem key={`item-${key}`} index={index} list={{
          key: key,
          displayName: lists[key].name
        }} />
      ))}
    </div>
  ));

  const handleSortEnd = ({oldIndex, newIndex})=> {
    const newValues = arrayMove(orders, oldIndex, newIndex);
    update('reorder_list', {
      orders: newValues
    });
  };

  return (
    <section>
      <ItemList lists={lists}
        orders={orders}
        useDragHandle={true}
        lockToContainerEdges={true}
        axis='y'
        helperClass='sorted'
        lockAxis='y'
        transitionDuration={0}
        onSortEnd={handleSortEnd} />
      <ListNewList />
    </section>
  );
}

IndexPage.contextTypes = {
  update: PropTypes.func
}

export default IndexPage;
