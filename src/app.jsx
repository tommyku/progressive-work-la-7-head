import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import Todo from './data/todo.js'
import PropTypes from 'prop-types'

class App extends React.Component {
  getChildContext() {
    return {update: this.update.bind(this)}
  }

  constructor(props) {
    super(props);
    let todo = {}
    let todos = [
      new Todo('Reply the comment on your blog', false),
      new Todo('Check with cyberport whether you can lease', true),
      new Todo('食龜苓膏', true),
    ];
    todos.forEach((item)=> {
      todo[item.uuid] = item;
    });

    const state = {
      todo: todo
    };
    this.state = state;
  }

  sortedTodos() {
    return Object.values(this.state.todo);
  }

  handleAdd({text}) {
    let newTodo = this.state.todo;
    let newItem = new Todo(text, false);
    newTodo[newItem.uuid] = newItem;
    this.setState({todo: newTodo});
  }

  handleRemove({uuid}) {
    let newTodo = this.state.todo;
    delete newTodo[uuid];
    this.setState({todo: newTodo});
  }

  handleToggle({uuid}) {
    let newTodo = this.state.todo;
    let updatedTodo = newTodo[uuid];
    updatedTodo.done = !updatedTodo.done;
    this.setState({todo: newTodo});
  }

  update(action, payload) {
    switch (action) {
      case 'add':
        this.handleAdd(payload);
        break;
      case 'remove':
        this.handleRemove(payload);
        break;
      case 'toggle':
        this.handleToggle(payload);
        break;
    }
  }

  render() {
    return (
      <Provider>
        <AppBar
          locationName='The Pool'
          location='pool'
          homeName='做野啦柒頭'
          home='/' />
        <TodoList values={this.sortedTodos()} />
      </Provider>
    );
  }
}

App.childContextTypes = {
  update: PropTypes.func
};

export default App;
