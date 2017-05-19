import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import Todo from './data/todo.js'
import PropTypes from 'prop-types'
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const LinkStyle = {
  color: '#999',
};

class App extends React.Component {
  getChildContext() {
    return {update: this.update.bind(this)}
  }

  constructor(props) {
    super(props);
    const stateTemplate = {
      listKey: 'default',
      lists: {
        'default': '做咩啫你',
      },
      todo: {
        'default': {}
      }
    };
    this.state = stateTemplate;
  }

  currentTodoList() {
    return this.state.todo[this.state.listKey];
  }

  sortedTodos() {
    let todos = Object.values(this.currentTodoList()).sort((a, b)=> {
      return (a.createdAt > b.createdAt) ? -1 : 1;
    });
    return todos;
  }

  handleAdd({text}) {
    let newTodo = this.currentTodoList();
    let newItem = new Todo(text, false);
    newTodo[newItem.uuid] = newItem;
    this.setState({todo: {
      [this.state.listKey]: newTodo
    }});
  }

  handleRemove({uuid}) {
    let newTodo = this.currentTodoList();
    delete newTodo[uuid];
    this.setState({todo: {
      [this.state.listKey]: newTodo
    }});
  }

  handleToggle({uuid}) {
    let newTodo = this.currentTodoList();
    let updatedTodo = newTodo[uuid];
    updatedTodo.done = !updatedTodo.done;
    this.setState({todo: {
      [this.state.listKey]: newTodo
    }});
  }

  handleNewList({key, name}) {
    let newState = this.state;
    this.state.lists[key] = name;
    this.state.todo[key] = {};
    this.setState(newState);
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
      case 'new_list':
        this.handleNewList(payload);
        break;
    }
  }

  render() {
    const Index = ({match})=> {
      return (
        <div>
          <AppBar
            homeName='要做的野'
            home='/' />
          <ul>
            {Object.keys(this.state.lists).map((key, index)=> {
              return (
                <li key={index}>
                  <Link to={`/list/${key}`}
                    style={LinkStyle}>
                    {this.state.lists[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    const List = ({match})=> {
      let key = match.params.list;
      return (
        <div>
          <AppBar
            locationName={this.state.lists[key]}
            location={key}
            homeName='要做的野'
            home='/' />
          <TodoList values={this.sortedTodos()}
            listKey={key}
            persisted={this.state.lists.hasOwnProperty(key)} />
        </div>
      );
    }
    return (
      <Router>
        <Provider>
          <Route exact path="/" render={Index} />
          <Route path="/list/:list" render={List} />
        </Provider>
      </Router>
    );
  }
}

App.childContextTypes = {
  update: PropTypes.func
};

export default App;
