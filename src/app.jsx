import React from 'react';
import TodoList from './todo_list.jsx';
import AppBar from './app_bar.jsx';
import EditItem from './edit_item.jsx';
import Todo from './data/todo.js';
import List from './data/list.js';
import LoginPage from './pages/login_page.jsx';
import IndexPage from './pages/index_page.jsx';
import ListEditPage from './pages/list_edit_page.jsx';
import ManagePage from './pages/manage_page.jsx';
import Spinner from './components/spinner.jsx';
import PropTypes from 'prop-types';
import LocalStorage from 'store';
import FileSaver from 'file-saver';
import {
  HashRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import Hoodie from '@hoodie/client';
import PouchDB from 'pouchdb-browser';
import Push from 'push.js';
import './app.css';

const hoodiePouch = PouchDB.defaults({
  auto_compaction: true
});

let hoodieHost = LocalStorage.get('hoodieHost') || 'localhost';

let hoodie = new Hoodie({
  url: hoodieHost,
  PouchDB: hoodiePouch
});

const history = createHashHistory();

const appStyle = {
  margin: 0,
  padding: 0,
  marginBottom: '20px'
};

class App extends React.Component {
  getChildContext() {
    return {
      update: this.update.bind(this),
      history: history,
      manage: this.manage.bind(this),
      listOrders: this.state.listOrders
    };
  }

  constructor(props) {
    super(props);
    const stateTemplate = {
      lists: {
        'default': {
          name: '做咩啫你',
          showAll: true,
          archived: false
        },
      },
      todo: {
        'default': {}
      },
      orders: {
        'default': []
      },
      listOrders: ['default'],
      notifications: {
        'default': []
      },
      login: false,
      loading: false,
      pulling: false,
      dirty: false,
      firstPull: true,
      migration: '@init',
      notified: [],
      lastRecordTime: null
    };
    this.registerHoodieHandlers = this.registerHoodieHandlers.bind(this);
    this.state = stateTemplate;
  }

  onSignInHandler() {
    this.setState({login: true});
    hoodie.store.find('state').then(this.onPullHandler.bind(this)).catch(()=>{
      hoodie.store.on('pull', this.onPullHandler.bind(this));
    });
  }

  onSignOutHandler() {
    this.setState({login: false});
  }

  onPullHandler(event, object) {
    if (typeof event === 'object' && typeof object === 'undefined') {
      object = event; // so that both store.change event and pull event can use
    }
    if (object._id !== 'state') return;

    let lastRecordTime = this.state.lastRecordTime;
    let createdAt = new Date(object.hoodie.createdAt);
    let updatedAt = new Date(object.hoodie.updatedAt);
    if (!lastRecordTime || lastRecordTime < createdAt)
      lastRecordTime = createdAt;
    if (updatedAt !== 'Invalid Date' && lastRecordTime < updatedAt)
      lastRecordTime = updatedAt;
    else
      return;

    if (!this.state.firstPull) {
      this.setState({pulling: true});
      setTimeout(()=> this.setState({pulling: false}), 500);
    } else {
      this.setState({firstPull: false});
    }

    const {lists, orders, todo, listOrders, notifications} = Object.assign({}, this.state, object);
    this.setState({
      lists: this.transformListCollection(lists),
      orders: orders,
      todo: this.transformTodoCollection(todo),
      notifications: notifications,
      listOrders: listOrders,
      lastRecordTime: lastRecordTime
    }, ()=> {
      this.dataMigrations();
    });
    hoodie.store.off('pull', this.onPullHandler);
  }

  registerHoodieHandlers() {
    hoodie.account.on('unauthenticate', this.onSignOutHandler.bind(this));
    hoodie.account.on('signout', this.onSignOutHandler.bind(this));
    hoodie.account.on('reauthenticate', this.onSignInHandler.bind(this));
    hoodie.account.on('signin', this.onSignInHandler.bind(this));
    hoodie.store.on('change', this.onPullHandler.bind(this));
  }

  componentWillMount() {
    setInterval(()=> this.notificationRun(), 5000);
    setInterval(()=> this.hoodieUpdate(), 5000);

    window.onbeforeunload = ()=> {
      if (this.state.dirty) {
        this.hoodieUpdate();
        return '認真？';
      }
    };

    let localStored = LocalStorage.get('state');
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
          this.onSignInHandler();
        } else {
          hoodie.account.signIn({
            username: LocalStorage.get('hoodieUser'),
            password: LocalStorage.get('hoodiePass')
          });
        }
        LocalStorage.remove('hoodieUser');
        LocalStorage.remove('hoodiePass');
      });
    }

    if (hoodieHost !== 'localhost') this.registerHoodieHandlers();
  }

  notificationRun() {
    const now = new Date();
    const shouldAlert = (alertAt)=> {
      const alertDate = new Date(alertAt);
      const diff = now.getTime() - alertDate.getTime();
      return diff < 60000 && diff > 0;
    };

    const expiredAlert = (alertAt)=> {
      const alertDate = new Date(alertAt);
      return now.getTime() - alertDate.getTime() > 60000;
    };

    const newNotified = [].concat(this.state.notified);
    let notifiedChanged = false;

    Object.keys(this.state.notifications).forEach((key)=> {
      this.state.notifications[key].forEach((uuid)=> {
        const todo = this.state.todo[key][uuid];
        const shown = this.state.notified.indexOf(todo.uuid) !== -1;
        const showAlert = todo.alertAt && shouldAlert(todo.alertAt);
        const removeExpiredAlert = todo.alertAt && expiredAlert(todo.alertAt);
        if (!shown && (showAlert || removeExpiredAlert)) {
          const displayText = `${todo.text.substring(0, 32)}${(todo.text.length > 32) ? '...' : ''}`;
          newNotified.push(todo.uuid);
          notifiedChanged = true;
          Push.create(displayText, {
            body: `來自 ${this.state.lists[key].name}`,
            vibrate: true,
            icon: {
              x16: 'res/ic_launcher.png',
              x32: 'res/ic_launcher.png',
            },
            timeout: 120000,
            link: `#/list/${key}`,
            serviceWorker: 'service-worker.js'
          });
        }
      });
    });
    if (notifiedChanged) this.setState({notified: newNotified});
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
      this.setState({todo: todo, migration: 'migrateDoneValue'}, ()=> {
        LocalStorage.set('afterMigration', this.state);
      });
    };

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
      this.setState({todo: todo, orders: orders, migration: 'migrateOrders'}, ()=> {
        LocalStorage.set('afterMigration', this.state);
      });
    };

    const migrateListOrders = ()=> {
      if (!this.state.listOrders || this.state.listOrders.length != Object.keys(this.state.lists).length) {
        const lists = this.state.lists;
        const listOrders = Object.keys(lists);
        this.setState({listOrders: listOrders, migration: 'migrateListOrders'}, ()=> {
          LocalStorage.set('afterMigration', this.state);
        });
      }
    };

    const migrateNotifications = ()=> {
      let containsAllLists = Object.keys(this.state.notifications).length !== Object.keys(this.state.lists).length;
      if (!this.state.notifications || containsAllLists) {
        const notifications = {};
        Object.keys(this.state.lists).forEach((key)=> notifications[key] = []);
        this.setState({notifications: notifications, migration: 'migrateNotifications'}, ()=> {
          LocalStorage.set('afterMigration', this.state);
        });
      } else {
        this.setState({migration: 'migrateNotifications'});
      }
    };

    const migrateArchiveOption = ()=> {
      const newLists = Object.assign({}, this.state.lists);
      Object.keys(newLists).forEach((key)=> {
        newLists[key].archived = (newLists[key].hasOwnProperty('archived')) ? newLists[key].archived : false;
      });
      this.setState({lists: newLists, migration: 'migrateArchiveOption'}, ()=> {
        LocalStorage.set('afterMigration', this.state);
      });
    };

    const migrations = {
      migrateDoneValue: migrateDoneValue,
      migrateOrders: migrateOrders,
      migrateListOrders: migrateListOrders,
      migrateNotifications: migrateNotifications,
      migrateArchiveOption: migrateArchiveOption
    };

    const migrationsSteps = [
      'migrateDoneValue',
      'migrateOrders',
      'migrateListOrders',
      'migrateNotifications',
      'migrateArchiveOption'
    ];

    let migrationHead = migrationsSteps.indexOf(this.state.migration) + 1;
    for (let i = migrationHead; i < migrationsSteps.length; ++i) {
      migrations[migrationsSteps[i]]();
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

  handleAdd({text, key}) {
    let newTodo = this.state.todo;
    let newOrders = this.state.orders;
    let newItem = new Todo({text: text, done: false});
    newTodo[key][newItem.uuid] = newItem;
    newOrders[key].unshift(newItem.uuid);
    return {todo: newTodo, orders: newOrders};
  }

  handleRemove({uuid, key}) {
    let newTodo = this.state.todo;
    let newOrders = this.state.orders;
    let newNotifications = this.state.notifications;
    let orderIndex = newOrders[key].indexOf(uuid);
    let notificationIndex = newNotifications[key].indexOf(uuid);
    delete newTodo[key][uuid];
    newOrders[key].splice(orderIndex, 1);
    newNotifications[key].splice(notificationIndex, notificationIndex === -1 ? 0 : 1);
    return {todo: newTodo, orders: newOrders, notifications: newNotifications};
  }

  handleUpdate({uuid, text, details, alertAt, key, redirectTo}) {
    let newTodo = this.state.todo;
    let newNotifications = this.state.notifications;
    newTodo[key][uuid].text = text;
    newTodo[key][uuid].details = details;
    newTodo[key][uuid].alertAt = alertAt;
    let notificationIndex = newNotifications[key].indexOf(uuid);
    if (newTodo[key][uuid].alertAt) {
      if (notificationIndex === -1) {
        newNotifications[key].push(uuid);
      }
    } else {
      newNotifications[key].splice(notificationIndex, notificationIndex === -1 ? 0 : 1);
    }
    this.setState({todo: newTodo}, ()=> {
      redirectTo && history.replace(redirectTo);
    });
    return {notifications: newNotifications};
  }

  handleDisableNotification({uuid, key}) {
    const todo = this.state.todo[key][uuid];
    return this.handleUpdate({
      uuid,
      key,
      text: todo.text,
      details: todo.details,
      alertAt: null,
      redirectTo: null
    });
  }

  handleUpdateList({key, name, redirectTo}) {
    const newLists = Object.assign({}, this.state.lists);
    const newList = new List(newLists[key]);
    newList.name = name;
    newLists[key] = newList;
    redirectTo && history.replace(redirectTo);
    return {lists: newLists};
  }

  handleToggleListArchive({key}) {
    const newLists = Object.assign({}, this.state.lists);
    newLists[key].archived = !newLists[key].archived;
    return {lists: newLists};
  }

  handleToggle({uuid, key}) {
    let newTodo = this.state.todo;
    let updatedTodo = newTodo[key][uuid];
    updatedTodo.nextDoneState();
    return {todo: newTodo};
  }

  handleNewList({key, name}) {
    let newState = this.state;
    newState.lists[key] = new List({name: name});
    newState.notifications[key] = [];
    newState.todo[key] = {};
    newState.orders[key] = [];
    newState.listOrders.push(key);
    return newState;
  }

  handleMove({from, to, uuid, redirectTo}) {
    let newState = this.state;
    let todo = new Todo(newState.todo[from][uuid]);
    newState.todo[to][uuid] = todo;
    newState.orders[to].unshift(uuid);
    if (todo.alertAt) {
      const notificationIndex = newState.notifications[from].indexOf(uuid);
      newState.notifications[to].push(uuid);
      newState.notifications[from].splice(notificationIndex, 1);
    }
    this.setState(newState);
    history.replace(redirectTo);
    return this.handleRemove({key: from, uuid: uuid});
  }

  handleReorder({key, uuids}) {
    let newOrders = this.state.orders;
    newOrders[key] = uuids;
    return {orders: newOrders};
  }

  handleReorderList({orders}) {
    return {listOrders: orders};
  }

  handleForceRemoveList({key}) {
    let newState = Object.assign({}, this.state);
    Object.keys(this.state.todo[key]).forEach(({uuid})=> {
      Object.assign(newState, this.handleRemove({uuid, key}));
    });
    return newState;
  }

  handleRemoveList({key}) {
    const emptyList = Object.keys(this.state.todo[key]).length === 0;
    const canDelete = emptyList || confirm(`${this.state.lists[key].name}仲有野唔刪得喎，真係要咁做？`);
    if (canDelete) {
      let newState = emptyList ? Object.assign({}, this.state) : this.handleForceRemoveList({key});
      let orderIndex = newState.listOrders.indexOf(key);
      delete newState.todo[key];
      delete newState.lists[key];
      delete newState.orders[key];
      delete newState.notifications[key];
      newState.listOrders.splice(orderIndex, 1);
      return newState;
    } else {
      return null;
    }
  }

  handleLogin({host, user, pass}) {
    hoodieHost = host;
    hoodie = new Hoodie({
      url: hoodieHost,
      PouchDB: hoodiePouch
    });
    this.registerHoodieHandlers();
    hoodie.account.signIn({
      username: user,
      password: pass
    });
    LocalStorage.set('hoodieHost', hoodieHost);
    return null;
  }

  handleSort({key}) {
    let newOrders = this.state.orders;
    let categorizedOrder = [[], [], [], []];
    newOrders[key].forEach((uuid)=> {
      const done = this.state.todo[key][uuid].done;
      categorizedOrder[done].push(uuid);
    });
    // swap 0 and 1 for 'doing' and 'default' tasks
    [categorizedOrder[0], categorizedOrder[1]] = [categorizedOrder[1], categorizedOrder[0]];
    newOrders[key] = categorizedOrder.reduce((sum, val)=> {
      return sum.concat(val);
    }, []);
    return {orders: newOrders};
  }

  handleToggleShowAll({key}) {
    let newLists = this.state.lists;
    newLists[key].showAll = !newLists[key].showAll;
    return {lists: newLists};
  }

  stateDataDump() {
    return {
      orders: this.state.orders,
      lists: this.state.lists,
      todo: this.state.todo,
      notifications: this.state.notifications,
      listOrders: this.state.listOrders
    };
  }

  manage(action) {
    switch (action) {
    case 'logout':
      hoodie.account.signOut().then(()=> this.setState({login: false}));
      break;
    case 'dump_data': {
      const blob = new Blob([JSON.stringify(this.stateDataDump())], {type: 'application/json;charset=utf-8'});
      FileSaver.saveAs(blob, '要做的野的.json');
      break;
    }
    default:
      return;
    }
  }

  hoodieUpdate() {
    if (hoodieHost === 'localhost' || !this.state.dirty || !hoodie) return;
    this.setState({loading: true});
    hoodie.store.updateOrAdd('state', this.stateDataDump())
      .catch(()=> {
        alert('can\'t update');
      })
      .then(()=> setTimeout(()=> {
        this.setState({loading: false, dirty: false});
      }, 250));
    LocalStorage.set('stateBackup', this.state);
  }

  update(action, payload) {
    if (this.state.pulling) {
      setTimeout(()=> this.update(action, payload), 500);
      return;
    }

    let newState = null;

    switch (action) {
    case 'add':
      newState = this.handleAdd(payload);
      break;
    case 'remove':
      newState = this.handleRemove(payload);
      break;
    case 'update':
      newState = this.handleUpdate(payload);
      break;
    case 'update_list':
      newState = this.handleUpdateList(payload);
      break;
    case 'toggle':
      newState = this.handleToggle(payload);
      break;
    case 'toggle_list_archive':
      newState = this.handleToggleListArchive(payload);
      break;
    case 'disable_notification':
      newState = this.handleDisableNotification(payload);
      break;
    case 'new_list':
      newState = this.handleNewList(payload);
      break;
    case 'move':
      newState = this.handleMove(payload);
      break;
    case 'reorder':
      newState = this.handleReorder(payload);
      break;
    case 'reorder_list':
      newState = this.handleReorderList(payload);
      break;
    case 'remove_list':
      newState = this.handleRemoveList(payload);
      break;
    case 'login':
      newState = this.handleLogin(payload);
      break;
    case 'sort':
      newState = this.handleSort(payload);
      break;
    case 'toggle_showall':
      newState = this.handleToggleShowAll(payload);
      break;
    }

    if (newState) {
      newState.dirty = true;
      this.setState(newState);
    }
  }

  render() {
    const Index = ()=> (
      (!this.state.login) ? (
        <Redirect to='/login' />
      ) : (
        <div>
          <AppBar
            homeName='要做的野'
            home='/' />
          <IndexPage lists={this.state.lists} orders={this.state.listOrders} />
        </div>
      )
    );

    const List = ({match})=> {
      let key = match.params.list;
      let locationName = (this.state.lists[key]) ? this.state.lists[key].name : '';
      let showAll = (this.state.lists[key]) ? this.state.lists[key].showAll : true;
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
    };

    const EditPage = ({match}) => {
      const {
        list,
        uuid
      } = match.params;
      let item;
      try {
        item = this.state.todo[list][uuid];
      } catch(err) {
        if (err instanceof TypeError) {
          return (<Redirect to={`/list/${list}`} />);
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

    const renderListEditPage = ({match})=> {
      const { params: { list } } = match;
      const listDisplayName = this.state.lists.hasOwnProperty(list) ? this.state.lists[list].name : '';
      return (this.state.login !== true) ? (
        <Redirect to='/' />
      ) : (
        <div>
          <AppBar
            homeName='要做的野'
            home='/'
            locationName={listDisplayName}
            location={`/list/${list}`} />
          <ListEditPage list={this.state.lists[list]} listKey={list} />
        </div>
      );
    };

    const renderManagePage = ()=> (
      (this.state.login !== true) ? (
        <Redirect to='/login' />
      ) : (
        <div>
          <AppBar
            homeName='要做的野' />
          <ManagePage />
        </div>
      )
    );

    return (
      <Router history={history}>
        <div style={appStyle}>
          <Route exact path="/login" render={renderLoginPage} />
          <Route exact path="/manage" render={renderManagePage} />
          <Route exact path="/" render={Index} />
          <Route exact path="/list/:list" render={List} />
          <Route exact path="/list/:list/edit" render={renderListEditPage} />
          <Route exact path="/list/:list/item/:uuid" render={EditPage} />
          <Spinner visible={this.state.loading} />
        </div>
      </Router>
    );
  }
}

App.childContextTypes = {
  update: PropTypes.func,
  manage: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }),
  listOrders: PropTypes.array.isRequired
};

export default App;
