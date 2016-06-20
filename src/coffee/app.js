// walkthrough jquery: http://jquerypagewalkthrough.github.io/example/example.html

/* Progress object */

function Progress(progressDOM) {
    this.statusText = progressDOM.find('.progress-text');
    this.bar = progressDOM.find('.progress-bar');
    this.progress = 0;
    this.set(this.progress);

    return this;
}

Progress.prototype.set = function(percentage) {
    if (typeof percentage != "number") {
	throw TypeError("Progress object accepts only number");
    }

    if (percentage < 0 || percentage > 100) {
	throw rangeError("Progress object accepts only number between 0 and 100");
    }

    this.progress = percentage;

    this.bar.css('width', percentage+'%');
    switch (true) {
    case (percentage == 0):
	this.statusText.html("戇鳩鳩發乜撚夢呀？");
	break;
    case (percentage <= 10):
	this.statusText.html("屌廢嘅");
	break;
    case (percentage <= 25):
	this.statusText.html("做到2046呀屌");
	break;
    case (percentage <= 50):
	this.statusText.html("屌做唔撚完呀")
	break;
    case (percentage <= 75):
	this.statusText.html("屌有排先做撚完呀");
	break;
    case (percentage < 100):
	this.statusText.html("就黎做完啦屌");
	break;
    case (percentage == 100):
	// this.statusText.html("做完訓啦");
	this.statusText.html("做完收皮啦");
	break;
    }
}

/* Todo object */

function Todo(appDOM, progress, l) {
    // intialize properties
    this.input = appDOM.find('.todo-input');
    this.list = appDOM.find('.todo-list');
    this.doing = null;
    this.taskCount = 0;
    this.doneCount = 0;
    this.progress = progress;
    this.storage = null;

    this.input.data('app', this);
    this.list.data('app', this);

    this.updateProgress();

    // handler of textbox
    this.input.on('keypress', function todoInputBoxHandler(e) {
	var keycode = (e.keyCode ? e.keyCode : e.which);
	var _this = $(this);
	if (keycode == '13' && _this.val() != "") {
	    // add list
	    _this.data('app').addListItem(_this.val());
	    _this.val("");
	}
    });
  
    // internal class Item
    this.Item = function(todo, value) {
	this.item = $("<span>", {
	    "class": "list-group-item",
	    "html": value
	});

	this.item.data('app', todo);

	this.item.click(function todoListItemHandler(e) {
	    var _this = $(this);
	    if (_this.hasClass('disabled')) {
		_this.data('app').yiuItem(_this);
	    }
	    if (_this.hasClass('active')) {
		var app = _this.data('app');
		app.finishItem(this);
		_this.popover('destroy');
		return;
	    }
	    _this.popover('toggle');
	    _this.parent().children('.list-group-item').not(_this).popover('hide');
	});

	// add popover for functionalities
	this.item.popover({
	    trigger: 'manual',
	    placement: 'bottom',
	    html: 'true', 
	    content: function () {
		var ding = 
		    $(
			"<button>", 
			{
			    'class': "btn btn-default",
			    'html': '頂'
			}
		    )
		    .data('item', this)
		    .click(function() {
			var item = $(this).data('item');
			$(item).data('app').dingItem(item);
			$(item).popover('hide');
		    });
		var yiu = $(
			"<button>", 
			{
			    'class': "btn btn-danger",
			    'html': '妖'
			}
		    )
		    .data('item', this)
		    .click(function() {
			var item = $(this).data('item');
			$(item).data('app').yiuItem(item);
			$(item).popover('hide');
		    });
		
		var div = $("<div>", {'class': 'btn-group'}).append(ding, yiu);
		return div;
	    }
	});

	return this.item;
    }

    // localstorage
    if (typeof(Storage) !== "undefined") {
	// get item
	if (localStorage.getItem('tasks') != null) {
	    var oldList = JSON.parse(localStorage.getItem('tasks'));
	    for (var i=0;i<oldList.length;++i) {
		this.addListItem(oldList[i].value);
		if (oldList[i].done) {
		    this.finishItem(this.doing);
		}
	    }
	}
    }

    if (l !== undefined) {
	if (Object.prototype.toString.call(l) === '[object Array]') {
	    for (var i=0;i<l.length;++i) {
		this.addListItem(l[i]);
	    }    
	} else {
	    throw TypeError("Expecting array in the third argument");
	}
    }

    return this;
}

Todo.prototype.addListItem = function(value) {
    // filter text
    var foulLang = {
	from: ['diu', 'pk', 'on9', 'lun', '7head'],
	to: ['屌', '仆街', '戇鳩', '撚', '柒頭']
    };
    
    for (var i=0; i<foulLang.from.length; ++i) {
	value = value.replace(new RegExp(foulLang.from[i], "g"), foulLang.to[i]);
    }

    // not the best way to do this, 
    // add data-binding and handler later
    this.list.find("#intro").remove();

    // add to bottom of list
    var item = new this.Item(this, value);
    this.list.append(item);

    if (this.taskCount-this.doneCount == 0) {
	this.doing = $(item);
	this.activate(item);
    }

    if (this.storage != null) {
	this.storage.push({'value': value, 'done': false});
    } else {
	this.storage = [
	    {'value': value, 'done': false}
	];
    }

    // re-calculate progress
    ++this.taskCount;
    this.updateProgress();
    this.save();
}

Todo.prototype.activate = function(dom) {
    $(dom).addClass('active');
}

Todo.prototype.deactivate = function(dom) {
    $(dom).removeClass('active');
}


Todo.prototype.finish = function(dom) {
    $(dom).removeClass('active');
    $(dom).addClass('disabled');
}

Todo.prototype.dingItem = function(dom) {
    // move up an item
    dom = $(dom);
    var prev = dom.prev('.list-group-item');
    if (prev.hasClass('disabled')) {
	return;
    }
    prev.before(dom);
    if (prev.is(this.doing)) {
	this.deactivate(prev);
	this.activate(dom);
	this.doing = dom;
    }
}

Todo.prototype.yiuItem = function(dom) {
    // delete an item
    dom = $(dom);
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
}

Todo.prototype.finishItem = function(dom) {
    if (!$(dom).is(this.doing)) {
	// not active item
	return;
    }

    ++this.doneCount;
    this.finish(dom);
    this.doing = $(dom).nextAll('.list-group-item').first();
    this.activate(this.doing);

    for (var i=0; i<this.storage.length; ++i) {
	if (!this.storage[i].done) {
	    this.storage[i].done = true;
	    break;
	}
    }

    this.updateProgress();
    this.save();
}

Todo.prototype.save = function() {
    if (typeof(Storage) !== "undefined") {
	localStorage.setItem('tasks', JSON.stringify(this.storage));
    }
}

Todo.prototype.updateProgress = function() {
    if (this.taskCount == 0) {
	// not the best way to implement this, 
	// I should add data binding between the list and a variable, 
	// then this sits in the handler for list change

	this.list.append($("<h4>", {
	    'id': "intro", 
	    'html': "<em>加撚野做啦仆街</em>",
	    'class': 'text-center text-muted'
	}));
	this.progress.set(0);
    } else {
	this.progress.set(100*this.doneCount/this.taskCount);
    }
}

/*
var a = new Todo(
    $("#todo-app"), 
    new Progress($("#progress")), 
    [
	'屌',
	'仆街',
	'Hi Auntie',
	'傻的嗎',
	'戇鳩'
    ]
);
*/

var app = new Todo($("#todo-app"), new Progress($("#progress")));
