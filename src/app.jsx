import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'
import Todo from './data/todo.js'

const App = (props)=> {
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

  const sortedTodos = ()=> {
    return Object.values(state.todo);
  }

  return (
    <Provider>
      <AppBar
        locationName='The Pool'
        location='pool'
        homeName='做野啦柒頭'
        home='/' />
      <TodoList values={sortedTodos()} />
    </Provider>
  );
}

export default App;
