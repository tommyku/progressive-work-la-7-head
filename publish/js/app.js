'use strict';

/* Progress object */
var Accent, Progress, Todo, app, progress, todoDom;

Progress = function(progressDOM) {
  this.statusText = progressDOM.find('.progress-text');
  this.bar = progressDOM.find('.progress-bar');
  this.progress = 0;
  this.set(this.progress);
  return this;
};


/* Todo object */

Todo = function(appDOM, progress, l) {
  var i;
  var i, oldList;
  this.header = appDOM.find('h3');
  this.input = appDOM.find('.todo-input');
  this.list = appDOM.find('.todo-list');
  this.doing = null;
  this.taskCount = 0;
  this.doneCount = 0;
  this.progress = progress;
  this.storage = null;
  this.header.text(Accent.t('header'));
  this.input.data('app', this);
  this.input.attr('placeholder', Accent.t('what'));
  this.list.data('app', this);
  this.updateProgress();
  this.input.on('keypress', function(e) {
    var _this, keycode;
    keycode = e.keyCode ? e.keyCode : e.which;
    _this = $(this);
    if (keycode === 13 && _this.val() !== '') {
      _this.data('app').addListItem(_this.val());
      _this.val('');
    }
  });
  this.Item = function(todo, value) {
    this.item = $('<span>', {
      'class': 'list-group-item',
      'html': value
    });
    this.id = Date.now().toString();
    this.item.data('id', this.id);
    this.item.data('app', todo);
    this.item.click(function(e) {
      var _this, app;
      _this = $(this);
      if (_this.hasClass('disabled')) {
        _this.data('app').yiuItem(_this);
      }
      if (_this.hasClass('active')) {
        app = _this.data('app');
        app.finishItem(this);
        _this.popover('destroy');
        return;
      }
      _this.popover('toggle');
      _this.parent().children('.list-group-item').not(_this).popover('hide');
    });
    this.item.popover({
      trigger: 'manual',
      placement: 'bottom',
      html: 'true',
      content: function() {
        var ding, div, yiu;
        ding = $('<button>', {
          'class': 'btn btn-default',
          'html': Accent.t('push')
        }).data('item', this).click(function() {
          var item;
          item = $(this).data('item');
          $(item).data('app').dingItem(item);
          $(item).popover('hide');
        });
        yiu = $('<button>', {
          'class': 'btn btn-danger',
          'html': Accent.t('remove')
        }).data('item', this).click(function() {
          var item;
          item = $(this).data('item');
          $(item).data('app').yiuItem(item);
          $(item).popover('hide');
        });
        div = $('<div>', {
          'class': 'btn-group'
        }).append(ding, yiu);
        return div;
      }
    });
    return this.item;
  };
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('tasks') !== null) {
      oldList = JSON.parse(localStorage.getItem('tasks'));
      i = 0;
      while (i < oldList.length) {
        this.addListItem(oldList[i].value);
        if (oldList[i].done) {
          this.finishItem(this.doing);
        }
        ++i;
      }
    }
  }
  if (l !== void 0) {
    if (Object.prototype.toString.call(l) === '[object Array]') {
      i = 0;
      while (i < l.length) {
        this.addListItem(l[i]);
        ++i;
      }
    } else {
      throw TypeError('Expecting array in the third argument');
    }
  }
  return this;
};

Progress.prototype.set = function(percentage) {
  if (typeof percentage !== 'number') {
    throw TypeError('Progress object accepts only number');
  }
  if (percentage < 0 || percentage > 100) {
    throw rangeError('Progress object accepts only number between 0 and 100');
  }
  this.progress = percentage;
  this.bar.css('width', percentage + '%');
  switch (true) {
    case percentage === 0:
      this.statusText.html(Accent.t('status_0'));
      break;
    case percentage <= 10:
      this.statusText.html(Accent.t('status_1'));
      break;
    case percentage <= 25:
      this.statusText.html(Accent.t('status_2'));
      break;
    case percentage <= 50:
      this.statusText.html(Accent.t('status_3'));
      break;
    case percentage <= 75:
      this.statusText.html(Accent.t('status_4'));
      break;
    case percentage < 100:
      this.statusText.html(Accent.t('status_5'));
      break;
    case percentage === 100:
      this.statusText.html(Accent.t('status_6'));
  }
};

Todo.prototype.addListItem = function(value) {
  var foulLang, i, item, itemAttributes;
  foulLang = {
    from: ['diu', 'pk', 'on9', 'lun', '7head'],
    to: ['屌', '仆街', '戇鳩', '撚', '柒頭']
  };
  i = 0;
  while (i < foulLang.from.length) {
    value = value.replace(new RegExp(foulLang.from[i], 'g'), foulLang.to[i]);
    ++i;
  }
  this.list.find('#intro').remove();
  item = new this.Item(this, value);
  this.list.append(item);
  if (this.taskCount - this.doneCount === 0) {
    this.doing = $(item);
    this.activate(item);
  }
  itemAttributes = {
    id: item.data('id'),
    value: value,
    done: false
  };
  if (this.storage !== null) {
    this.storage.push(itemAttributes);
  } else {
    this.storage = new Array(itemAttributes);
  }
  ++this.taskCount;
  this.updateProgress();
  this.save();
};

Todo.prototype.activate = function(dom) {
  $(dom).addClass('active');
};

Todo.prototype.deactivate = function(dom) {
  $(dom).removeClass('active');
};

Todo.prototype.finish = function(dom) {
  $(dom).removeClass('active');
  $(dom).addClass('disabled');
};

Todo.prototype.dingItem = function(dom) {
  var prev;
  dom = $(dom);
  prev = dom.prev('.list-group-item');
  if (prev.hasClass('disabled')) {
    return;
  }
  prev.before(dom);
  if (prev.is(this.doing)) {
    this.deactivate(prev);
    this.activate(dom);
    this.doing = dom;
  }
};

Todo.prototype.yiuItem = function(dom) {
  dom = $(dom);
  this.removeFromStorage(dom.data('id'));
  this.save();
  dom.popover('destroy');
  if (dom.is(this.doing)) {
    this.doing = dom.nextAll('.list-group-item').first();
    this.activate(this.doing);
  }
  if (dom.hasClass('disabled')) {
    --this.doneCount;
  }
  --this.taskCount;
  dom.remove();
  this.updateProgress();
};

Todo.prototype.finishItem = function(dom) {
  var i;
  if (!$(dom).is(this.doing)) {
    return;
  }
  ++this.doneCount;
  this.finish(dom);
  this.doing = $(dom).nextAll('.list-group-item').first();
  this.activate(this.doing);
  i = 0;
  while (i < this.storage.length) {
    if (!this.storage[i].done) {
      this.storage[i].done = true;
      break;
    }
    ++i;
  }
  this.updateProgress();
  this.save();
};

Todo.prototype.removeFromStorage = function(id) {
  var index;
  index = -1;
  this.storage.forEach(function(item, index_) {
    if (item.id === id) {
      return index = index_;
    }
  });
  if (index !== -1) {
    return this.storage.splice(index, 1);
  }
};

Todo.prototype.save = function() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(this.storage));
  }
};

Todo.prototype.updateProgress = function() {
  if (this.taskCount === 0) {
    this.list.append($('<h4>', {
      'id': 'intro',
      'html': "<em>" + (Accent.t('prompt')) + "</em>",
      'class': 'text-center text-muted'
    }));
    this.progress.set(0);
  } else {
    this.progress.set(100 * this.doneCount / this.taskCount);
  }
};


/* Accent object */

Accent = (function() {
  function Accent() {}

  Accent.KEYS = ['push', 'remove', 'prompt', 'status_0', 'status_1', 'status_2', 'status_3', 'status_4', 'status_5', 'status_6'];

  Accent.ACCENTS = {
    粗口: {
      push: '頂',
      remove: '妖',
      prompt: '加撚野做啦仆街',
      what: '做乜撚野',
      header: '做野啦柒頭',
      status_0: '戇鳩鳩發乜撚夢呀？',
      status_1: '屌廢嘅',
      status_2: '做到2046呀屌',
      status_3: '屌做唔撚完呀',
      status_4: '屌有排先做撚完呀',
      status_5: '就黎做完啦屌',
      status_6: '做完收皮啦'
    },
    en: {
      push: 'Move up',
      remove: 'Remove',
      prompt: 'Add a task',
      what: 'I need to do...',
      header: 'Work',
      status_0: 'Better start now than later',
      status_1: 'Keep going',
      status_2: 'You are doing good',
      status_3: 'What will you do after finishing them all?',
      status_4: 'Great progress',
      status_5: 'Almost done!',
      status_6: 'All done!'
    }
  };

  Accent.isValidLanguage = function(lang) {
    return this.ACCENTS.hasOwnProperty(lang);
  };

  Accent.t = function(key) {
    var lang;
    lang = window.location.hash.slice(1) || Cookies.get('lang', lang);
    if (this.isValidLanguage(lang)) {
      Cookies.set('lang', lang);
    } else {
      lang = '粗口';
    }
    return this.ACCENTS[lang][key];
  };

  return Accent;

})();


/* Main object */

todoDom = $('#todo-app');

progress = new Progress($('#progress'));

app = new Todo(todoDom, progress);

if (typeof navigator['serviceWorker'] !== 'undefined') {
  window.addEventListener('load', function() {
    return navigator.serviceWorker.register('./service-worker.js').then(function() {
      return console.log('Service Worker Registered');
    });
  });
}
