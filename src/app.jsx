import React from 'react'
import Provider from './provider.jsx'
import TodoList from './todo_list.jsx'
import AppBar from './app_bar.jsx'

const App = (props)=> {
  const state = {
    todo: [
      {text: 'reply the comment on your blog', done: false, createdAt: (new Date()).toString()},
      {text: 'Check with cyberport whether you can lease', done: false, createdAt: (new Date()).toString()},
      {text: '食龜苓膏', done: true, createdAt: (new Date()).toString()},
    ]
  };
  return (
    <Provider>
      <AppBar
        locationName='The Pool'
        location='pool'
        homeName='做野啦柒頭'
        home='/' />
      <TodoList values={state.todo} />
    </Provider>
  );
}

export default App;
