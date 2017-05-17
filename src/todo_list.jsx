import React from 'react'
import TodoItem from './todo_item.jsx'
import TodoNewItem from './todo_new_item.jsx'

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
      ...other
    } = item;

    return (
      <TodoItem
        key={index}
        text={text}
        done={done}
        createdAt={createdAt}
        {...other}
      />
    );
  }

  render() {
    const {
      style,
      ...other
    } = this.props;
    let todoStyle = Object.assign({}, TodoStyle, style);

    return (
      <section {...other} style={todoStyle}>
        {this.props.values.map(this.prepareTodoItem)}
        <TodoNewItem />
      </section>
    );
  }
}

export default TodoList;
