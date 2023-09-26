var browserPrefixes = ['moz', 'ms', 'o', 'webkit'],
isVisible = true; // internal flag, defaults to true
alerted = false;
window.isNormal = false;
// get the correct attribute name
function getHiddenPropertyName(prefix) {
	return (prefix ? prefix + 'Hidden' : 'hidden');
}

// get the correct event name
function getVisibilityEvent(prefix) {
	return (prefix ? prefix : '') + 'visibilitychange';
}

// get current browser vendor prefix
function getBrowserPrefix() {
	for (var i = 0; i < browserPrefixes.length; i++) {
		if (getHiddenPropertyName(browserPrefixes[i]) in document) {
			// return vendor prefix
			return browserPrefixes[i];
		}
	}

	// no vendor prefix needed
	return null;
}

// bind and handle events
var browserPrefix = getBrowserPrefix(),
	hiddenPropertyName = getHiddenPropertyName(browserPrefix),
	visibilityEventName = getVisibilityEvent(browserPrefix);

function onVisible() {
	// prevent double execution
	if (isVisible) {
		return;
	}
	// change flag value
	isVisible = true;
}

function onHidden() {
	// prevent double execution
	if (!isVisible) {
		return;
	}

	// change flag value
	isVisible = false;
	if(!window.isNormal) {
	let msg = 'Please avoid leaving the page, this may result in missing the exam!';
	
	fetch('http://localhost:7777/api/session/alert/' + msg);
	if(!alerted){
	 alert(msg);
	 alerted = true;
	}
	}
}

function handleVisibilityChange(forcedFlag) {
	// forcedFlag is a boolean when this event handler is triggered by a
	// focus or blur eventotherwise it's an Event object
	if (typeof forcedFlag === "boolean") {
		if (forcedFlag) {
			return onVisible();
		}

		return onHidden();
	}

	if (document[hiddenPropertyName]) {
		return onHidden();
	}

	return onVisible();
}

document.addEventListener(visibilityEventName, handleVisibilityChange, false);

// extra event listeners for better behaviour
document.addEventListener('focus', function() {
	handleVisibilityChange(true);
}, false);

document.addEventListener('blur', function() {
	handleVisibilityChange(false);
}, false);

window.addEventListener('focus', function() {
	handleVisibilityChange(true);
}, false);

window.addEventListener('blur', function() {
	handleVisibilityChange(false);
}, false);