import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import EditItem from './edit_item.jsx'
import ListNewList from './list_new_list.jsx'
import ListItem from './list_item.jsx'
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
      history: history
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

  componentDidMount() {
    const migrateDoneValue = ()=> {
      let todo = this.state.todo;
      Object.keys(todo).forEach((key)=> {
        Object.keys(todo[key]).forEach((itemKey)=> {
          if (typeof todo[key][itemKey].done === 'boolean') {
            todo[key][itemKey].done = todo[key][itemKey].done ? 1 : 0;
          }
        });
      });
      this.setState({todo: todo});
    }

    migrateDoneValue();
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
    let todos = Object.values(this.getTodoList(key));
    todos = todos.sort((a, b)=> {
      return (a.index > b.index) ? -1 : 1;
    });
    return todos;
  }

  handleAdd({text, key}) {
    let newTodo = this.state.todo;
    let newItem = new Todo(text, false, Object.keys(newTodo[key]).length);
    newTodo[key][newItem.uuid] = newItem;
    this.setState({todo: newTodo});
  }

  handleRemove({uuid, key}) {
    let newTodo = this.state.todo;
    delete newTodo[key][uuid];
    this.setState({todo: newTodo});
  }

  handleUpdate({uuid, text, key, redirectTo}) {
    let newTodo = this.state.todo;
    newTodo[key][uuid].text = text;
    this.setState({todo: newTodo});
    redirectTo && history.replace(redirectTo);
  }

  handleToggle({uuid, key}) {
    let newTodo = this.state.todo;
    let updatedTodo = newTodo[key][uuid];
    // 0: 未, 1: 做, 2: 完, 3: 算
    updatedTodo.done = (updatedTodo.done + 1) % 4;
    this.setState({todo: newTodo});
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
    todo.index = Object.keys(newState.todo[to]).length;
    newState.todo[to][uuid] = todo;
    this.setState(newState);
    history.replace(redirectTo);
    this.handleRemove({key: from, uuid: uuid});
  };

  handleReorder({key, uuids}) {
    let newTodo = this.state.todo;
    uuids.forEach((uuid, index)=> {
      newTodo[key][uuid].index = index;
    });
    this.setState({todo: newTodo});
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
      case 'reorder':
        this.handleReorder(payload);
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
          <div>
            {Object.keys(this.state.lists).map((key, index)=> {
              let doneCount = this.getDoneCount(key);
              let undoneCount = this.getItemCount(key) - doneCount;
              let list = {
                key: key,
                displayName: this.state.lists[key]
              };
              return (
                <ListItem key={`list-${index}`}
                  list={list}
                  doneCount={doneCount}
                  undoneCount={undoneCount} />
              );
            })}
          </div>
          <ListNewList />
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
            home='/'
            extra={(
              <span>
                <span style={{padding: '0 0.5em'}}>{'\u203A'}</span>
                <span style={{padding: '0 0.5em'}}>改野</span>
              </span>
            )}/>
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  })
};

export default App;
