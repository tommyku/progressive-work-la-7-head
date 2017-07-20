import {v4 as guid} from 'uuid';

class Todo {
  constructor(arg) {
    switch (typeof arg) {
    case 'Todo':
      this.constructAsTodo(arg);
      break;
    case 'object':
      this.constructAsObject(arg);
      break;
    default:
      this.constructAsObject({text: 'nothing'});
    }
  }

  constructAsTodo(todo) {
    this.constructAsObject(todo.serialize());
  }

  constructAsObject({text, done, details, status, uuid, createdAt, startedAt, alertAt}) {
    this.text = text;
    this.done = done || 0;
    this.details = details || '';
    this.uuid = uuid || guid();
    this.status = status || '';
    this.createdAt = createdAt || (new Date()).toString();
    this.startedAt = startedAt;
    this.alertAt = alertAt;
  }

  serialize() {
    return {
      text: this.text,
      done: this.done,
      details: this.details,
      uuid: this.uuid,
      status: this.status,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      alertAt: this.alertAt
    };
  }

  nextDoneState() {
    // 0: 未, 1: 做, 2: 完, 3: 算
    this.done = (this.done + 1) % 4;
    switch (this.done) {
    case 1:
      this.startedAt = (new Date()).toString();
      break;
    case 2:
      this.alertAt = null;
      break;
    default:
      this.startAt = null;
    }
  }
}

export default Todo;
