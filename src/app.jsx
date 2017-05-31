import React from 'react'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import EditItem from './edit_item.jsx'
import Todo from './data/todo.js'
import List from './data/list.js'
import LoginPage from './pages/login_page.jsx'
import IndexPage from './pages/index_page.jsx'
import PropTypes from 'prop-types'
import LocalStorage from 'store'
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import createHashHistory from 'history/createHashHistory';
import Hoodie from '@hoodie/client'
import './app.css'

const hoodieHost = LocalStorage.get('hoodieHost') || 'localhost';

let hoodie = new Hoodie({
  url: hoodieHost,
  PouchDB: require('pouchdb-browser')
});

const LinkStyle = {
  color: '#999',
};

const history = createHashHistory();

const appStyle = {
  margin: 0,
  padding: 0
}

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
        'default': {
          name: '做咩啫你',
          showAll: true
        },
      },
      todo: {
        'default': {}
      },
      orders: {
        'default': []
      },
      login: false
    };
    this.state = stateTemplate;
  }

  componentWillMount() {
    const onSignInHandler = (a)=> {
      this.setState({login: true});
      hoodie.store.find('state').then(onPullHandler).catch((e)=>{
        hoodie.store.on('pull', onPullHandler);
      });
    }

    const onSignOutHandler = ()=> {
      this.setState({login: false});
    }

    const onPullHandler = (event, object)=> {
      if (typeof event === 'object' && typeof object === 'undefined') {
        object = event; // so that both store.change event and pull event can use
      }
      if (object._id !== 'state')
        return
      else
        hoodie.store.off('pull', onPullHandler);
      const {lists, orders, todo} = object;
      this.setState({
        lists: this.transformListCollection(lists),
        orders: orders,
        todo: this.transformTodoCollection(todo)
      }, ()=> {
        this.dataMigrations();
      });
    }

    let localStored = LocalStorage.get('state')
    if (localStored) {
      const {lists, orders, todo} = localStored;
      this.setState({
        lists: lists,
        orders: orders,
        todo: todo
      }, ()=> {
        this.dataMigrations();
      });
      LocalStorage.remove('state');
    } else {
      hoodie.account.get('session').then((session)=> {
        if (session) {
          onSignInHandler();
        } else {
          hoodie.account.on('signin', onSignInHandler);
          hoodie.account.signIn({
            username: LocalStorage.get('hoodieUser'),
            password: LocalStorage.get('hoodiePass')
          });
        }
        LocalStorage.remove('hoodieUser');
        LocalStorage.remove('hoodiePass');
      });
    }

    hoodie.account.on('unauthenticate', onSignOutHandler);
    hoodie.account.on('signout', onSignOutHandler);
    hoodie.account.on('reauthenticate', onSignInHandler);
    hoodie.account.on('signin', onSignInHandler);
    hoodie.store.on('change', onPullHandler);
  }

  transformListCollection(lists) {
    const newLists = {};
    Object.keys(lists).forEach((key)=> newLists[key] = new List(lists[key]));
    return newLists;
  }

  transformTodoCollection(todo) {
    const todos = {};
    Object.keys(todo).forEach((key)=> {
      todos[key] = {};
      Object.keys(todo[key]).forEach((uuid)=> {
        todos[key][uuid] = new Todo(todo[key][uuid]);
      });
    });
    return todos;
  }

  dataMigrations() {
    // To patch:
    // 1. logout of hoodie
    // 2. set localStage 'state'
    // 3. refresh

    LocalStorage.set('beforeMigration', this.state);

    const migrateDoneValue = ()=> {
      let todo = this.state.todo;
      Object.keys(todo).forEach((key)=> {
        Object.keys(todo[key]).forEach((itemKey)=> {
          if (typeof todo[key][itemKey].done === 'boolean') {
            todo[key][itemKey].done = todo[key][itemKey].done ? 1 : 0;
          }
        });
      });
      this.setState({todo: todo}, ()=> {
        LocalStorage.set('afterMigration', this.state);
      });
    }

    const migrateOrders = ()=> {
      let todo = this.state.todo;
      let orders = this.state.orders || {};
      Object.keys(todo).forEach((key)=> {
        if (!orders[key] || Object.keys(todo[key]).length != Object.keys(orders[key]).length) {
          let todos = Object.values(todo[key]);
          todos = todos.sort((a, b)=> {
            return (a.index > b.index) ? -1 : 1;
          });
          todos.forEach((item)=> {
            delete todo[key][item.uuid].index;
          });
          orders[key] = todos.map(item => item.uuid);
        }
      });
    }

    migrateDoneValue();
    migrateOrders();
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

  handleAdd({text, key}) {
    let newTodo = this.state.todo;
    let newOrders = this.state.orders;
    let newItem = new Todo({text: text, done: false});
    newTodo[key][newItem.uuid] = newItem;
    newOrders[key].unshift(newItem.uuid);
    this.setState({todo: newTodo, orders: newOrders});
  }

  handleRemove({uuid, key}) {
    let newTodo = this.state.todo;
    let newOrders = this.state.orders;
    let orderIndex = newOrders[key].indexOf(uuid);
    delete newTodo[key][uuid];
    newOrders[key].splice(orderIndex, 1);
    this.setState({todo: newTodo, orders: newOrders});
  }

  handleUpdate({uuid, text, details, key, redirectTo}) {
    let newTodo = this.state.todo;
    newTodo[key][uuid].text = text;
    newTodo[key][uuid].details = details;
    this.setState({todo: newTodo});
    redirectTo && history.replace(redirectTo);
  }

  handleToggle({uuid, key}) {
    let newTodo = this.state.todo;
    let updatedTodo = newTodo[key][uuid];
    updatedTodo.nextDoneState();
    this.setState({todo: newTodo});
  }

  handleNewList({key, name}) {
    let newState = this.state;
    this.state.lists[key] = new List({name: name});
    this.state.todo[key] = {};
    this.state.orders[key] = [];
    this.setState(newState);
  }

  handleMove({from, to, uuid, redirectTo}) {
    let newState = this.state;
    let todo = new Todo(newState.todo[from][uuid]);
    newState.todo[to][uuid] = todo;
    newState.orders[to].unshift(uuid);
    this.setState(newState);
    history.replace(redirectTo);
    this.handleRemove({key: from, uuid: uuid});
  }

  handleReorder({key, uuids}) {
    let newOrders = this.state.orders;
    newOrders[key] = uuids;
    this.setState({orders: newOrders});
  }

  handleRemoveList({key}) {
    if (Object.keys(this.state.todo[key]).length > 0) {
      alert(`${this.state.lists[key].name}仲有野唔刪得喎`);
    } else {
      let newState = this.state;
      delete newState.todo[key];
      delete newState.lists[key];
      delete newState.orders[key];
      this.setState(newState);
    }
  }

  handleLogin({host, user, pass}) {
    hoodie = new Hoodie({
      url: host,
      PouchDB: require('pouchdb-browser')
    });
    hoodie.account.signIn({
      username: user,
      password: pass
    });
    LocalStorage.set('hoodieHost', host);
  }

  handleSort({key}) {
    let newOrders = this.state.orders;
    let categorizedOrder = [[], [], [], []];
    newOrders[key].forEach((uuid)=> {
      const done = this.state.todo[key][uuid].done;
      categorizedOrder[done].push(uuid);
    });
    // swap 0 and 1 for 'doing' and 'default' tasks
    let tmp;
    tmp = categorizedOrder[0];
    categorizedOrder[0] = categorizedOrder[1];
    categorizedOrder[1] = tmp;
    newOrders[key] = categorizedOrder.reduce((sum, val)=> {
      return sum.concat(val);
    }, []);
    this.setState({orders: newOrders});
  }

  handleToggleShowAll({key}) {
    let newLists = this.state.lists;
    newLists[key].showAll = !newLists[key].showAll;
    this.setState({lists: newLists});
  }

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
      case 'remove_list':
        this.handleRemoveList(payload);
        break;
      case 'login':
        this.handleLogin(payload);
        break;
      case 'sort':
        this.handleSort(payload);
        break;
      case 'toggle_showall':
        this.handleToggleShowAll(payload);
        break;
    }

    hoodie.store.updateOrAdd('state', {
      orders: this.state.orders,
      lists: this.state.lists,
      todo: this.state.todo
    }).catch((c)=> {
      alert('can\'t update');
    });
    LocalStorage.set('stateBackup', this.state)
  }

  render() {
    const Index = ({match})=> (
      (!this.state.login) ? (
        <Redirect to='/login' />
      ) : (
        <div>
          <AppBar
            homeName='要做的野'
            home='/' />
          <IndexPage lists={this.state.lists} />
        </div>
      )
    );

    const List = ({match})=> {
      let key = match.params.list;
      let locationName = (this.state.lists[key]) ? this.state.lists[key].name : ''
      let showAll = (this.state.lists[key]) ? this.state.lists[key].showAll : true
      return (
        <div>
          <AppBar
            locationName={locationName}
            location={`/list/${key}`}
            homeName='要做的野'
            home='/' />
          <TodoList values={this.state.todo[key]}
            orders={this.state.orders[key]}
            listKey={key}
            showAll={showAll}
            persisted={this.state.lists.hasOwnProperty(key)} />
        </div>
      );
    }

    const EditPage = ({match, history}) => {
      const {
        list,
        uuid
      } = match.params;
      let item;
      try {
        item = this.state.todo[list][uuid];
      } catch(err) {
        if (err instanceof TypeError) {
          history.replace(`/list/${list}`);
        }
      }
      return (
        <div>
          <AppBar
            locationName={this.state.lists[list].name}
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
            item={item}
            lists={this.state.lists}
            listKey={list} />
        </div>
      );
    };

    const renderLoginPage = ()=> (
      (this.state.login === true) ? (
        <Redirect to='/' />
      ) : (
        <div>
          <AppBar
            homeName='要做的野' />
          <LoginPage />
        </div>
      )
    );

    return (
      <Router history={history}>
        <div style={appStyle}>
          <Route exact path="/login" render={renderLoginPage} />
          <Route exact path="/" render={Index} />
          <Route exact path="/list/:list" render={List} />
          <Route exact path="/list/:list/item/:uuid" render={EditPage} />
        </div>
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
