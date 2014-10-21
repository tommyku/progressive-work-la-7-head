// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript

/* Progress object */

function Progress(progressDOM) {
    this.statusText = progressDOM.find('.progress-text');
    this.bar = progressDOM.find('.progress-bar');
}

Progress.prototype.set = function(percentage) {
    console.log(percentage);
    if (typeof percentage != "number") {
	throw TypeError("Progress object accepts only number");
    }

    if (percentage < 0 || percentage > 100) {
	throw rangeError("Progress object accepts only number between 0 and 100");
    }

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
	this.statusText.html("做完訓啦");
	break;
    }
}

var p = new Progress($("#progress"));
p.set(0);
