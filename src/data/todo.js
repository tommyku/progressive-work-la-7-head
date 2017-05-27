import {v4 as guid} from 'uuid';

class Todo {
  constructor(text, done = null, details = null, status = null, uuid = null, createdAt = null, startedAt = null) {
    this.text = text;
    this.done = done || 0;
    this.details = details || '';
    this.uuid = uuid || guid();
    this.status = status || '';
    this.createdAt = createdAt || (new Date()).toString();
    this.startedAt = startedAt;
  }
}

export default Todo;
