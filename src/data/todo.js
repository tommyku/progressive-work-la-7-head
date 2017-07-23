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
    this.createdAt = createdAt || this.datetimeNow();
    this.startedAt = startedAt;
    this.alertAt = alertAt;
  }

  datetimeNow() {
    let d = new Date();
    let lo = (n)=> (n < 10) ? `0${n}` : n;
    const [
      year, month, day, hour, minute, second
    ] = [
      d.getFullYear(),
      lo(d.getMonth()+1),
      lo(d.getDate()),
      lo(d.getHours()),
      lo(d.getMinutes()),
      lo(d.getSeconds())
    ];
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
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
      this.startedAt = this.datetimeNow();
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
