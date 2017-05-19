import React from 'react'
import TodoItem from './todo_item.jsx'
import TodoNewItem from './todo_new_item.jsx'
import TodoNewList from './todo_new_list.jsx'

const TodoStyle = {
};

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }

  prepareTodoItem(item, index) {
    const {
      text,
      done,
      createdAt,
      uuid,
      ...other
    } = item;

    return (
      <TodoItem
        key={index}
        text={text}
        done={done}
        uuid={uuid}
        createdAt={createdAt}
        {...other}
      />
    );
  }

  render() {
    const {
      persisted,
      listKey,
      style,
      ...other
    } = this.props;
    let todoStyle = Object.assign({}, TodoStyle, style);

    return (
      <section {...other} style={todoStyle}>
        {persisted && <TodoNewItem />}
        {!persisted && <TodoNewList listKey={listKey} />}
        {this.props.values.map(this.prepareTodoItem)}
      </section>
    );
  }
}

export default TodoList;
