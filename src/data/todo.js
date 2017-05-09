import {v4 as guid} from 'uuid';

class Todo {
  constructor(text, done = null, status = null, uuid = null, createdAt = null) {
    this.text = text;
    this.done = done || false;
    this.uuid = uuid || guid();
    this.status = status || '';
    this.createdAt = createdAt || (new Date()).toString();
  }

  toogleDone() {
    this.done = !this.done;
  }

  setText(text) {
    this.text = text;
  }
}

export default Todo;
