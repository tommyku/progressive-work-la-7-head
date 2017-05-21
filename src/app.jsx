import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import EditItem from './edit_item.jsx'
import Todo from './data/todo.js'
import PropTypes from 'prop-types'
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import createHashHistory from 'history/createHashHistory';

const LinkStyle = {
  color: '#999',
};

const history = createHashHistory();

class App extends React.Component {
  getChildContext() {
    return {
      update: this.update.bind(this),
    }
  }

  constructor(props) {
    super(props);
    const stateTemplate = {
      lists: {
        'default': '做咩啫你',
      },
      todo: {
        'default': {}
      }
    };
    this.state = stateTemplate;
  }

  componentWillMount() {
    let localStoredJSON = localStorage.getItem('state')
    if (localStoredJSON !== null) {
      this.setState(JSON.parse(localStoredJSON))
    }
  }

  getTodoList(key) {
    return this.state.todo[key] || {};
  }

  getDoneCount(key) {
    let todo = Object.values(this.getTodoList(key));
    return todo.reduce((count, item)=> {
      return count += item.done ? 1 : 0;
    }, 0);
  }

  getItemCount(key) {
    return Object.values(this.getTodoList(key)).length;
  }

  sortedTodos(key) {
    let todos = Object.values(this.getTodoList(key)).sort((a, b)=> {
      return (a.done == b.done) ? ((a.createdAt > b.createdAt) ? -1 : 1) : (b.done) ? -1 : 1;
    });
    return todos;
  }

  handleAdd({text, key}) {
    let newTodo = this.getTodoList(key);
    let newItem = new Todo(text, false);
    newTodo[newItem.uuid] = newItem;
    this.setState({todo: {
      [key]: newTodo
    }});
  }

  handleRemove({uuid, key}) {
    let newTodo = this.getTodoList(key);
    delete newTodo[uuid];
    this.setState({todo: {
      [key]: newTodo
    }});
  }

  handleUpdate({uuid, text, key}) {
    let newTodo = this.getTodoList(key);
    newTodo[uuid].text = text;
    this.setState({todo: {
      [key]: newTodo
    }});
  }

  handleToggle({uuid, key}) {
    let newTodo = this.getTodoList(key);
    let updatedTodo = newTodo[uuid];
    updatedTodo.done = !updatedTodo.done;
    this.setState({todo: {
      [key]: newTodo
    }});
  }

  handleNewList({key, name}) {
    let newState = this.state;
    this.state.lists[key] = name;
    this.state.todo[key] = {};
    this.setState(newState);
  }

  handleMove({from, to, uuid, redirectTo}) {
    let newState = this.state;
    let todo = Object.assign({}, newState.todo[from][uuid]);
    newState.todo[to][uuid] = todo;
    this.setState(newState);
    history.replace(redirectTo);
    newState = this.state;
    delete newState.todo[from][uuid]
    this.setState(newState);
  };

  update(action, payload) {
    switch (action) {
      case 'add':
        this.handleAdd(payload);
        break;
      case 'remove':
        this.handleRemove(payload);
        break;
      case 'update':
        this.handleUpdate(payload);
        break;
      case 'toggle':
        this.handleToggle(payload);
        break;
      case 'new_list':
        this.handleNewList(payload);
        break;
      case 'move':
        this.handleMove(payload);
        break;
    }
    localStorage.setItem('state', JSON.stringify(this.state))
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
              let doneCount = this.getDoneCount(key);
              let undoneCount = this.getItemCount(key) - doneCount;
              return (
                <li key={index}>
                  <Link to={`/list/${key}`}
                    style={LinkStyle}>
                    {`${this.state.lists[key]}（${doneCount}完${undoneCount}未）`}
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
            location={`/list/${key}`}
            homeName='要做的野'
            home='/' />
          <TodoList values={this.sortedTodos(key)}
            listKey={key}
            persisted={this.state.lists.hasOwnProperty(key)} />
        </div>
      );
    }
    const EditPage = ({match, history}) => {
      const {
        list,
        uuid
      } = match.params;
      return (
        <div>
          <AppBar
            locationName={this.state.lists[list]}
            location={`/list/${list}`}
            homeName='要做的野'
            home='/' />
          <EditItem
            item={this.state.todo[list][uuid]}
            lists={this.state.lists}
            listKey={list} />
        </div>
      );
    };
    return (
      <Router history={history}>
        <Provider>
          <Route exact path="/" render={Index} />
          <Route exact path="/list/:list" render={List} />
          <Route exact path="/list/:list/item/:uuid" render={EditPage} />
        </Provider>
      </Router>
    );
  }
}

App.childContextTypes = {
  update: PropTypes.func,
};

export default App;
