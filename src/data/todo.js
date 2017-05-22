import {v4 as guid} from 'uuid';

class Todo {
  constructor(text, done = null, index = null, status = null, uuid = null, createdAt = null) {
    this.text = text;
    this.done = done || 0;
    this.index = index || 0;
    this.uuid = uuid || guid();
    this.status = status || '';
    this.createdAt = createdAt || (new Date()).toString();
  }
}

export default Todo;
