class List {
  constructor(arg) {
    switch (typeof arg) {
      case 'List':
        this.constructAsList(arg);
        break;
      case 'object':
        this.constructAsObject(arg);
        break;
      case 'string':
        this.constructAsObject({name: arg});
        break
      default:
        this.constructAsObject({name: 'nothing'});
    }
  }

  constructAsList(list) {
    this.constructAsObject(list.serialize());
  }

  constructAsObject({name, showAll}) {
    this.name = name;
    this.showAll = showAll === true;
  }

  serialize() {
    return {
      name: this.name,
      showAll: this.showAll,
    };
  }
}

export default List;
