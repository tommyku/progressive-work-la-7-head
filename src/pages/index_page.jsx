import React, { PureComponent } from 'react';
import ListNewList from '../list_new_list.jsx'
import ListItem from '../list_item.jsx'

const IndexPage = (props)=> {
  const {
    lists,
    ...others
  } = props;

  const ItemList = (
    <div>
      {Object.keys(lists).map((key, index)=> {
        let list = {
          key: key,
          displayName: lists[key].name
        };
        return (
          <ListItem key={`list-${index}`}
            list={list} />
        );
      })}
    </div>
  );

  return (
    <section>
      {ItemList}
      <ListNewList />
    </section>
  );
}

export default IndexPage;
