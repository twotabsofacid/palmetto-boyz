(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var socket = io();
var TextCombing = require('./modules/text-combing');

Public = (function(){

	// Stored DOM elements
	var UI = {
		body: null,
		loginForm: null,
		loginInput: null,
		chatForm: null,
		chatInput: null,
		messages: null,
		sidebar: null,
		sidebarPeople: null
	};

	// Stored DOM values
	var UIValues = {
		bodyHeight: null
	};

	// Colors for users
	var userColors 	=  [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		],
		colorsLen 	= userColors.length;

	/**
	 * Initalize function, to focus the login name input,
	 * and add listeners for dom events and socket events
	 */
	var _initialize = function() {
		_cacheElements();
		_addDomListeners();
		_addSocketListeners();
		UI.loginInput.select();
	};

	/**
	 * Cache all the UI elements
	 */
	var _cacheElements = function() {
		UI.body = document.body;
		UIValues.bodyHeight = UI.body.scrollHeight;
		UI.loginForm = document.getElementById('login-form');
		UI.loginInput = document.getElementById('login-input');
		UI.chatForm = document.getElementById('chat-form');
		UI.chatInput = document.getElementById('chat-input');
		UI.messages = document.getElementById('messages');
		UI.sidebar = document.getElementById('sidebar');
		UI.sidebarPeople = document.getElementById('sidebar-people');
	};

	/**
	 * Add dom listeners, for things like form submissions
	 */
	var _addDomListeners = function() {
		UI.chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('new message', UI.chatInput.value);
			UI.chatInput.value = '';
			return false;
		});
		UI.loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('add user', UI.loginInput.value);
			UI.loginForm.parentNode.removeChild(UI.loginForm);
			UI.chatInput.select();
			return false;
		});
		UI.sidebarPeople.addEventListener('click', function(e) {
			e.preventDefault();
			socket.emit('start private chat', e.target.getAttribute('data-id'));
			console.log(e);
			var data = {
				username: "paul",
				usernumber: 1,
				userId: e.target.getAttribute('data-id')
			}
			openChatRoomWith(data);
			return false;
		});
	};

	/**
	 * Add socket listeners
	 */
	var _addSocketListeners = function() {
		socket.on('user joined', function(data) {
			updateGroupUsers(data, 'joined');
		});
		socket.on('user left', function(data) {
			updateGroupUsers(data, 'left');
		});
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
		socket.on('start private chat', function(data) {
			console.log(data);
			openChatRoomWith(data);
		});
	};

	/**
	 * When someone leaves or enters the group, this gets called
	 * @param  {Object} -- includes data.username, data.usernumber, and data.userCount
	 * @param  {String} -- either "joined" or "left", from _addSocketListeners()
	 */
	var updateGroupUsers = function(data, infoString) {
		UI.messages.innerHTML += '<li class="message notification">' + data.username + ' has ' + infoString + ' the group.</li>';
		UI.messages.innerHTML += '<li class="message notification notification--total-number">There are now ' + data.userCount + ' users in the group.</li>';
		forceScrollToBottom();
		UI.sidebarPeople.innerHTML = '';
		for (var name in data.usernames) {
			UI.sidebarPeople.innerHTML += '<li id="person-' + data.usernames[name] + '" data-id="' + data.userIds[name] + '" class="person">' + data.usernames[name] + '</li>';
		}
	};

	/**
	 * Open a private chat room with a user
	 * @param  {object} -- includes data.username, data.usernumber, and data.userId
	 */
	var openChatRoomWith = function(data) {
		// Here we want to open up a new window, that's the same as the existing chat window but instead has a listener for 'new private message'. Then when we send a private message we want to produce it on the screen, and then ping it directly to the socket we want to see it.
	};

	/**
	 * When someone submits a new message to the chat
	 * @param {Object} -- includes data.username and data.message
	 */
	var addChatMessage = function(data) {
		if (data.message != '') {
			var color = userColors[data.usernumber % (colorsLen)];
			var messageBody = TextCombing.hasImage(data.message) ? '<img src="' + data.message + '"/>' : data.message;
			UI.messages.innerHTML += '<li class="message"><span class="user" style="color:' + color + '">' + data.username + '</span> ' + messageBody + '</li>';
			forceScrollToBottom();
		}
	};

	/**
	 * Force scroll to the bottom of the page
	 */
	var forceScrollToBottom = function() {
		UIValues.bodyHeight = UI.body.scrollHeight;
		window.scrollTo(0, UIValues.bodyHeight);
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();
},{"./modules/text-combing":2}],2:[function(require,module,exports){
'use strict';

var TextCombing = (function() {

	var checkForImage = function(text) {
		var splitArray = text.split('.');
		var lastString = splitArray[splitArray.length - 1];
		if (lastString == 'png' || lastString == 'jpg' || lastString == 'jpeg' || lastString == 'gif') {
			return true;
		}
		else {
			return false;
		}
	};

	return {
		hasImage: function(text) {
			return checkForImage(text);
		}
	}

}());

module.exports = TextCombing;
},{}]},{},[1]);
