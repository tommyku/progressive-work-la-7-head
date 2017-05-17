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
    const state = {
      todo: {}
    };
    this.state = state;
  }

  sortedTodos() {
    let todos = Object.values(this.state.todo).sort((a, b)=> {
      return (a.createdAt > b.createdAt) ? -1 : 1;
    });
    return todos;
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
          homeName='要做的野'
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
