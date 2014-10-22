/* Progress object */

function Progress(progressDOM) {
    this.statusText = progressDOM.find('.progress-text');
    this.bar = progressDOM.find('.progress-bar');
    this.progress = 0;
    this.set(this.progress);

    return this;
}

Progress.prototype.set = function(percentage) {
    console.log(percentage);
    if (typeof percentage != "number") {
	throw TypeError("Progress object accepts only number");
    }

    if (percentage < 0 || percentage > 100) {
	throw rangeError("Progress object accepts only number between 0 and 100");
    }

    this.progress = percentage;

    this.bar.css('width', percentage+'%');
    switch (true) {
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

    this.input.data('app', this);
    this.list.data('app', this);

    // handler of textbox
    this.input.on('keypress', function todoInputBoxHandler(e) {
	var keycode = (e.keyCode ? e.keyCode : e.which);
	var _this = $(this);
	console.log('yo');
	if (keycode == '13' && _this.val() != "") {
	    // add list
	    console.log(_this.val());
	    _this.data('app').addListItem(_this.val());
	    _this.val("");
	}
    });
  
    // internal class Item
    this.Item = function(todo, value) {
	// replace string to foul language
	// # later

	this.item = $("<span>", {
	    "class": "list-group-item",
	    "html": value
	});

	this.item.data('app', todo);

	this.item.click(function todoListItemHandler(e) {
	    var _this = $(this);
	    if (_this.hasClass('disabled')) {
		return;
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
    /*
    if (typeof(Storage) !== "undefined") {
	// get item
	var oldList = JSON.parse(localStorage.tasks);
	for (i=0;i<oldList.length;++i) {
	    this.addListItem(oldList[i]);
	}
    }
    */

    if (l !== undefined) {
	if (Object.prototype.toString.call(l) === '[object Array]') {
	    for (i=0;i<l.length;++i) {
		this.addListItem(l[i]);
	    }    
	} else {
	    throw TypeError("Expecting array in the third argument");
	}
    }

    return this;
}

Todo.prototype.addListItem = function(value) {
    // add to bottom of list
    var item = new this.Item(this, value);
    this.list.append(item);

    if ((this.taskCount-this.doneCount) == 0) {
	this.doing = $(item);
	this.activate(item);
    }

    // re-calculate progress
    ++this.taskCount;
    this.updateProgress();
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
    this.updateProgress();
}

Todo.prototype.updateProgress = function() {
    this.progress.set(100*this.doneCount/this.taskCount);
}

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
