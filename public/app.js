var APP = APP || {};
var socket = io();
var runningMan = require('running-man');
var faces = require('cool-ascii-faces');

APP.Application = (function(){

	$('form').submit(function() {
		socket.emit('chat message', $('#message').val());
		$('#message').val('');
		return false;
	});

	socket.on('chat message', function(msg) {
		var msgArray = msg.split('.'),
			msgEnding = msgArray[msgArray.length - 1];
		if (msgEnding === 'jpg' || msgEnding === 'jpeg' || msgEnding === 'png' || msgEnding === 'gif') {
			$('#messages').append($('<li><img src="' + msg + '"></li>'));
		}
		else if (msg.match(/quote/gi) !== null) {
			$('#messages').append($('<li>').text(runningMan.quote()));
		}
		else if (msg.match(/face/gi) !== null) {
			$('#messages').append($('<li>').text(faces()));
		}
		else if (msg !== '') {
			$('#messages').append($('<li>').text(msg));
		}
		$('html, body').animate({scrollTop: $('body').height()}, 200);
	});

	socket.on('user joined', function(hasJoined) {
		if (hasJoined) {
			$('#messages').append($('<li class="room-activity">').text('[A USER HAS JOINED]'));
		}
		else {
			$('#messages').append($('<li class="room-activity">').text('[A USER HAS LEFT]'));
		}
	});

})();